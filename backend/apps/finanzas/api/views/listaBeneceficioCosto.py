from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Prefetch
from django.utils import timezone
from dateutil.parser import parse as parse_date
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
from apps.finanzas.api.models.historialBeneficioCosto import HistorialBeneficioCosto
from apps.trazabilidad.api.models.HerramientasModel import Herramientas
from apps.trazabilidad.api.models.UsosHerramientasModel import UsosHerramientas

class ListCultivoEconomicViewSet(viewsets.ViewSet):
    """
    ViewSet para operaciones económicas de cultivos.
    Endpoints:
    - resumen_economico: Resumen de costos, ventas, beneficio y relación B/C por cultivo.
    - historial_beneficio_costo: Historial de registros con filtros por cultivos y fechas.
    """
    
    def _calculate_depreciation(self, tiempos, uso_herramienta):
        """Calcula la depreciación de una herramienta."""
        herramienta = uso_herramienta.fk_Herramienta
        if not herramienta or not tiempos:
            return 0
        # Usar vida_util si existe, o 5 años por defecto
        vida_util_minutos = getattr(herramienta, 'vida_util', 5 * 365 * 24 * 60)
        costo_por_minuto = herramienta.valorTotal / vida_util_minutos
        return costo_por_minuto * tiempos * uso_herramienta.unidades

    @action(detail=False, methods=['get'])
    def resumen_economico(self, request):
        try:
            prefetch_plantaciones = Prefetch(
                'plantaciones_set',
                queryset=Plantaciones.objects.prefetch_related(
                    Prefetch('cosechas_set', queryset=Cosechas.objects.all())
                )
            )
            prefetch_actividades = Prefetch(
                'actividades_set',
                queryset=Actividades.objects.prefetch_related(
                    Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                    Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                    'tiempoactividadcontrol_set'
                )
            )
            cultivos = Cultivos.objects.select_related('fk_Especie').prefetch_related(
                'semilleros_set',
                prefetch_plantaciones,
                prefetch_actividades
            ).all()

            resumenes = []
            for cultivo in cultivos:
                nombre_especie = cultivo.fk_Especie.nombre if cultivo.fk_Especie else None
                actividades = cultivo.actividades_set.all()
                plantaciones = cultivo.plantaciones_set.all()
                cosechas_ids = Cosechas.objects.filter(fk_Plantacion__in=plantaciones).values_list('id', flat=True)
                afecciones_ids = Afecciones.objects.filter(fk_Plantacion__in=plantaciones).values_list('id', flat=True)
                controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids).prefetch_related(
                    Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                    Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                    'tiempoactividadcontrol_set'
                )

                # Costos de insumos
                insumos_actividades = UsosInsumos.objects.filter(fk_Actividad__in=actividades).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                insumos_controles = UsosInsumos.objects.filter(fk_Control__in=controles).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                total_insumos = int(round(insumos_actividades + insumos_controles))

                # Mano de obra
                mano_obra_actividades = TiempoActividadControl.objects.filter(fk_actividad__in=actividades).aggregate(total=Sum('valorTotal'))['total'] or 0
                mano_obra_controles = TiempoActividadControl.objects.filter(fk_control__in=controles).aggregate(total=Sum('valorTotal'))['total'] or 0
                total_mano_obra = int(round(mano_obra_actividades + mano_obra_controles))

                # Depreciación
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

                # Ventas (usando VentaCosecha)
                total_ventas = VentaCosecha.objects.filter(cosecha__id__in=cosechas_ids).aggregate(total=Sum('valor_total'))['total'] or 0

                total_costos = total_insumos + total_mano_obra + total_depreciacion
                beneficio = total_ventas - total_costos
                relacion_bc = round(total_ventas / total_costos, 2) if total_costos > 0 else 0.0

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
                    from math import isclose
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

                resumen = {
                    "cultivo_id": cultivo.id,
                    "nombre_especie": nombre_especie,
                    "nombre_cultivo": cultivo.nombre,
                    "fecha_siembra": fecha_siembra.strftime("%Y-%m-%d") if fecha_siembra else None,
                    "costo_insumos": total_insumos,
                    "total_mano_obra": total_mano_obra,
                    "total_depreciacion": total_depreciacion,
                    "total_costos": total_costos,
                    "total_ventas": int(round(total_ventas)),
                    "beneficio": int(round(beneficio)),
                    "relacion_beneficio_costo": relacion_bc
                }
                resumenes.append(resumen)
            return Response(resumenes)
        except ValueError as e:
            return Response(
                {"error": f"Error de validación: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Cultivos.DoesNotExist:
            return Response(
                {"error": "Uno o más cultivos no encontrados"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error interno: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='historial-beneficio-costo')
    def historial_beneficio_costo(self, request):
        try:
            cultivos_ids = request.query_params.getlist('cultivos_ids[]', None)
            fecha_inicio = request.query_params.get('fecha_inicio', None)
            fecha_fin = request.query_params.get('fecha_fin', None)

            historial_qs = HistorialBeneficioCosto.objects.select_related('fk_Cultivo')
            if cultivos_ids:
                cultivos_ids = [int(cid) for cid in cultivos_ids if cid.isdigit()]
                historial_qs = historial_qs.filter(fk_Cultivo__id__in=cultivos_ids)
            if fecha_inicio:
                try:
                    parse_date(fecha_inicio)
                    historial_qs = historial_qs.filter(fecha_registro__gte=fecha_inicio)
                except ValueError:
                    return Response(
                        {"error": "Formato de fecha_inicio inválido. Use YYYY-MM-DD"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            if fecha_fin:
                try:
                    parse_date(fecha_fin)
                    historial_qs = historial_qs.filter(fecha_registro__lte=fecha_fin)
                except ValueError:
                    return Response(
                        {"error": "Formato de fecha_fin inválido. Use YYYY-MM-DD"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            historial_qs = historial_qs.order_by('fk_Cultivo__id', '-fecha_registro')
            historial_data = [{
                "cultivo_id": registro.fk_Cultivo.id,
                "nombre_cultivo": registro.fk_Cultivo.nombre,
                "fecha_registro": registro.fecha_registro.strftime("%Y-%m-%d %H:%M:%S"),
                "costo_insumos": registro.costo_insumos,
                "total_mano_obra": registro.total_mano_obra,
                "total_depreciacion": registro.total_depreciacion,
                "total_costos": registro.total_costos,
                "total_ventas": registro.total_ventas,
                "beneficio": registro.beneficio,
                "relacion_beneficio_costo": registro.relacion_beneficio_costo
            } for registro in historial_qs]
            return Response(historial_data)
        except Cultivos.DoesNotExist:
            return Response(
                {"error": "Uno o más cultivos no encontrados"},
                status=status.HTTP_404_NOT_FOUND
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