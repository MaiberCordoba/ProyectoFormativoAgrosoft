from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Prefetch
from django.utils import timezone
from django.core.exceptions import FieldError
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.models.cosechaVenta import VentaCosecha
from apps.trazabilidad.api.models.SemillerosModel import Semilleros
from apps.trazabilidad.api.models.HerramientasModel import Herramientas
from apps.trazabilidad.api.models.UsosHerramientasModel import UsosHerramientas
from apps.finanzas.api.models.historialBeneficioCosto import HistorialBeneficioCosto
from math import isclose

class CultivoEconomicViewSet(viewsets.ViewSet):
    """
    ViewSet para operaciones económicas de un cultivo específico.
    Endpoint:
    - resumen_economico: Resumen detallado de costos, ventas, beneficio, relación B/C y detalles de actividades, controles, cosechas y ventas.
    """
    
    def _calculate_depreciation(self, tiempos, uso_herramienta):
        """Calcula la depreciación de una herramienta."""
        herramienta = uso_herramienta.fk_Herramienta
        if not herramienta or not tiempos:
            return 0
        vida_util_minutos = getattr(herramienta, 'vida_util', 5 * 365 * 24 * 60)
        costo_por_minuto = herramienta.valorTotal / vida_util_minutos
        return costo_por_minuto * tiempos * uso_herramienta.unidades

    @action(detail=True, methods=['get'], url_path='resumen-economico')
    def resumen_economico(self, request, pk=None):
        try:
            cultivo = Cultivos.objects.select_related('fk_Especie').prefetch_related(
                'semilleros_set',
                Prefetch('plantaciones_set', queryset=Plantaciones.objects.prefetch_related(
                    Prefetch('cosechas_set', queryset=Cosechas.objects.select_related('fk_UnidadMedida'))
                ))
            ).get(pk=pk)
            
            nombre_especie = cultivo.fk_Especie.nombre if cultivo.fk_Especie else None
            actividades = Actividades.objects.filter(fk_Cultivo=cultivo).select_related(
                'fk_TipoActividad', 'fk_Usuario'
            ).prefetch_related(
                'tiempoactividadcontrol_set',
                Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta'))
            )
            
            plantaciones = cultivo.plantaciones_set.all()
            afecciones_ids = Afecciones.objects.filter(fk_Plantacion__in=plantaciones).values_list('id', flat=True)
            controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids).select_related(
                'fk_TipoControl', 'fk_Afeccion__fk_Plaga', 'fk_Afeccion__fk_Plaga__fk_Tipo'
            ).prefetch_related(
                Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                'tiempoactividadcontrol_set'
            )
            
            # Costos de insumos
            insumos_actividades = UsosInsumos.objects.filter(fk_Actividad__in=actividades).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
            insumos_controles = UsosInsumos.objects.filter(fk_Control__in=controles).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
            total_insumos = int(round(float(insumos_actividades) + float(insumos_controles)))
            
            # Costos de mano de obra
            mano_obra_actividades = TiempoActividadControl.objects.filter(fk_actividad__in=actividades).aggregate(total=Sum('valorTotal'))['total'] or 0
            mano_obra_controles = TiempoActividadControl.objects.filter(fk_control__in=controles).aggregate(total=Sum('valorTotal'))['total'] or 0
            total_mano_obra = int(round(float(mano_obra_actividades) + float(mano_obra_controles)))
            
            # Costos de depreciación
            total_depreciacion = 0
            for actividad in actividades:
                tiempos = actividad.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                for uso_herramienta in actividad.usosherramientas_set.all():
                    total_depreciacion += self._calculate_depreciation(tiempos, uso_herramienta)
            for control in controles:
                tiempos = control.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                for uso_herramienta in control.usosherramientas_set.all():
                    total_depreciacion += self._calculate_depreciation(tiempos, uso_herramienta)
            total_depreciacion = int(round(total_depreciacion))
            
            # Ventas
            cosechas_ids = Cosechas.objects.filter(fk_Plantacion__in=plantaciones).values_list('id', flat=True)
            ventas_cosechas = VentaCosecha.objects.filter(cosecha__id__in=cosechas_ids).select_related('venta', 'cosecha', 'unidad_medida')
            total_ventas = ventas_cosechas.aggregate(total=Sum('valor_total'))['total'] or 0
            
            # Detalle de actividades
            detalle_actividades = []
            for actividad in actividades:
                tiempos = actividad.tiempoactividadcontrol_set.all().aggregate(
                    total_tiempo=Sum('tiempo'),
                    total_valor=Sum('valorTotal')
                )
                insumos_actividad = []
                total_insumos_actividad = 0
                for insumo in actividad.usosinsumos_set.all():
                    insumos_actividad.append({
                        "nombre": insumo.fk_Insumo.nombre,
                        "cantidad": insumo.cantidadProducto,
                        "unidad": insumo.fk_UnidadMedida.nombre if insumo.fk_UnidadMedida else None,
                        "costo": insumo.costoUsoInsumo
                    })
                    total_insumos_actividad += float(insumo.costoUsoInsumo)
                
                depreciacion_actividad = 0
                herramientas_actividad = []
                tiempos_actividad = tiempos['total_tiempo'] or 0
                for uso_herramienta in actividad.usosherramientas_set.all():
                    depreciacion = self._calculate_depreciation(tiempos_actividad, uso_herramienta)
                    herramientas_actividad.append({
                        "nombre": uso_herramienta.fk_Herramienta.nombre,
                        "unidades": uso_herramienta.unidades,
                        "tiempo_uso": tiempos_actividad,
                        "depreciacion": int(round(depreciacion))
                    })
                    depreciacion_actividad += depreciacion
                
                detalle_actividades.append({
                    "tipo_actividad": actividad.fk_TipoActividad.nombre if actividad.fk_TipoActividad else None,
                    "responsable": actividad.fk_Usuario.nombre if actividad.fk_Usuario else None,
                    "fecha": actividad.fecha.strftime("%Y-%m-%d"),
                    "tiempo_total": tiempos_actividad,
                    "costo_mano_obra": float(tiempos.get('total_valor', 0) or 0),
                    "insumos": insumos_actividad,
                    "total_insumos_actividad": int(round(total_insumos_actividad)),
                    "herramientas": herramientas_actividad,
                    "total_depreciacion_actividad": int(round(depreciacion_actividad))
                })
            
            # Detalle de controles
            detalle_controles = []
            for control in controles:
                tiempos = control.tiempoactividadcontrol_set.all().aggregate(
                    total_tiempo=Sum('tiempo'),
                    total_valor=Sum('valorTotal')
                )
                insumos_control = []
                total_insumos_control = 0
                for insumo in control.usosinsumos_set.all():
                    insumos_control.append({
                        "nombre": insumo.fk_Insumo.nombre,
                        "cantidad": insumo.cantidadProducto,
                        "unidad": insumo.fk_UnidadMedida.nombre if insumo.fk_UnidadMedida else None,
                        "costo": insumo.costoUsoInsumo
                    })
                    total_insumos_control += float(insumo.costoUsoInsumo)
                
                depreciacion_control = 0
                herramientas_control = []
                tiempos_control = tiempos['total_tiempo'] or 0
                for uso_herramienta in control.usosherramientas_set.all():
                    depreciacion = self._calculate_depreciation(tiempos_control, uso_herramienta)
                    herramientas_control.append({
                        "nombre": uso_herramienta.fk_Herramienta.nombre,
                        "unidades": uso_herramienta.unidades,
                        "tiempo_uso": tiempos_control,
                        "depreciacion": int(round(depreciacion))
                    })
                    depreciacion_control += depreciacion
                
                detalle_controles.append({
                    "descripcion": control.descripcion,
                    "fecha": control.fechaControl.strftime("%Y-%m-%d"),
                    "tipo_control": control.fk_TipoControl.nombre if control.fk_TipoControl else None,
                    "plaga": control.fk_Afeccion.fk_Plaga.nombre if control.fk_Afeccion.fk_Plaga else None,
                    "tipo_plaga": control.fk_Afeccion.fk_Plaga.fk_Tipo.nombre if control.fk_Afeccion.fk_Plaga else None,
                    "tiempo_total": tiempos_control,
                    "costo_mano_obra": float(tiempos.get('total_valor', 0) or 0),
                    "insumos": insumos_control,
                    "total_insumos_control": int(round(total_insumos_control)),
                    "herramientas": herramientas_control,
                    "total_depreciacion_control": int(round(depreciacion_control))
                })
            
            # Detalle de cosechas
            detalle_cosechas = []
            for plantacion in plantaciones:
                for cosecha in plantacion.cosechas_set.all():
                    detalle_cosechas.append({
                        "cantidad": float(cosecha.cantidad),
                        "unidad": cosecha.fk_UnidadMedida.nombre if cosecha.fk_UnidadMedida else None,
                        "fecha": cosecha.fecha.strftime("%Y-%m-%d"),
                        "plantacion_id": plantacion.id,
                        "valor_gramo": float(cosecha.valorGramo) if cosecha.valorGramo else None
                    })
            
            # Detalle de ventas
            detalle_ventas = []
            for venta_cosecha in ventas_cosechas:
                detalle_ventas.append({
                    "numero_factura": venta_cosecha.venta.numero_factura,
                    "cantidad": float(venta_cosecha.cantidad),
                    "unidad": venta_cosecha.unidad_medida.nombre if venta_cosecha.unidad_medida else None,
                    "precio_unitario": float(venta_cosecha.precio_unitario),
                    "descuento": float(venta_cosecha.descuento),
                    "valor_total": float(venta_cosecha.valor_total),
                    "fecha": venta_cosecha.venta.fecha.strftime("%Y-%m-%d"),
                    "cosecha_id": venta_cosecha.cosecha.id
                })
            
            # Cálculos finales
            total_costos = total_insumos + total_mano_obra + total_depreciacion
            beneficio = total_ventas - total_costos
            relacion_bc = round(float(total_ventas) / total_costos, 2) if total_costos > 0 else 0.0
            
            # Fecha de siembra
            primer_semillero = cultivo.semilleros_set.order_by('fechasiembra').first()
            primera_plantacion = plantaciones.order_by('fechaSiembra').first()
            fecha_siembra = (
                primer_semillero.fechasiembra if primer_semillero else
                primera_plantacion.fechaSiembra if primera_plantacion else
                None
            )
            
            # Historial
            ultimo_historial = HistorialBeneficioCosto.objects.filter(fk_Cultivo=cultivo).order_by('-fecha_registro').first()
            crear_registro = True
            if ultimo_historial:
                crear_registro = (
                    not isclose(ultimo_historial.costo_insumos, total_insumos, rel_tol=1e-2) or
                    not isclose(ultimo_historial.total_mano_obra, total_mano_obra, rel_tol=1e-2) or
                    not isclose(ultimo_historial.total_depreciacion, total_depreciacion, rel_tol=1e-2) or
                    not isclose(ultimo_historial.total_costos, total_costos, rel_tol=1e-2) or
                    not isclose(ultimo_historial.total_ventas, total_ventas, rel_tol=1e-2) or
                    not isclose(ultimo_historial.beneficio, beneficio, rel_tol=1e-2) or
                    not isclose(ultimo_historial.relacion_beneficio_costo, relacion_bc, rel_tol=1e-2)
                )
            
            if crear_registro:
                HistorialBeneficioCosto.objects.create(
                    fk_Cultivo=cultivo,
                    costo_insumos=total_insumos,
                    total_mano_obra=total_mano_obra,
                    total_depreciacion=total_depreciacion,
                    total_costos=total_costos,
                    total_ventas=total_ventas,
                    beneficio=beneficio,
                    relacion_beneficio_costo=relacion_bc,
                    fecha_registro=timezone.now()
                )
            
            # Respuesta
            data = {
                "cultivo_id": cultivo.id,
                "nombre_especie": nombre_especie,
                "nombre_cultivo": cultivo.nombre,
                "fecha_siembra": fecha_siembra.strftime("%Y-%m-%d") if fecha_siembra else None,
                "total_insumos": total_insumos,
                "total_mano_obra": total_mano_obra,
                "total_depreciacion": total_depreciacion,
                "total_costos": total_costos,
                "total_ventas": int(round(total_ventas)),
                "beneficio": int(round(beneficio)),
                "relacion_beneficio_costo": relacion_bc,
                "detalle": {
                    "actividades": {
                        "total": actividades.count(),
                        "actividades_detalladas": detalle_actividades
                    },
                    "controles": {
                        "total": controles.count(),
                        "controles_detallados": detalle_controles
                    },
                    "cosechas": {
                        "total": len(detalle_cosechas),
                        "cosechas_detalladas": detalle_cosechas
                    },
                    "ventas": {
                        "total": ventas_cosechas.count(),
                        "ventas_detalladas": detalle_ventas
                    }
                }
            }
            
            return Response(data)
            
        except Cultivos.DoesNotExist:
            return Response({"error": "Cultivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except FieldError as e:
            return Response(
                {"error": f"Error en la consulta de datos: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValueError as e:
            return Response(
                {"error": f"Error de validación: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Error interno: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )