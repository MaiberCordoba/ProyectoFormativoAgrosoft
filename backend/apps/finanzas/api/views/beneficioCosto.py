from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Prefetch
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.ventas import Ventas
from apps.trazabilidad.api.models.SemillerosModel import Semilleros

class CultivoEconomicViewSet(viewsets.ViewSet):
    """
    ViewSet para operaciones económicas de cultivos
    Incluye endpoint para obtener resumen económico de un cultivo específico
    """
    
    @action(detail=True, methods=['get'], url_path='resumen-economico')
    def resumen_economico(self, request, pk=None):
        """
        Obtiene el resumen económico completo de un cultivo
        ---
        Parámetros:
        - pk: ID del cultivo
        
        Retorna:
        - Datos económicos: costos, ventas, beneficios y relación B/C
        - Información del semillero, especie y variedad
        """
        try:
            # 1. Obtener el cultivo con su especie
            cultivo = Cultivos.objects.select_related(
                'fk_Especie'
            ).prefetch_related(
                'semilleros_set',
                Prefetch('plantaciones_set', 
                    queryset=Plantaciones.objects.prefetch_related(
                        Prefetch('cosechas_set', queryset=Cosechas.objects.all())
                    )
                )
            ).get(pk=pk)
            
            # 2. Obtener nombre de la especie
            nombre_especie = cultivo.fk_Especie.nombre if cultivo.fk_Especie else None
            
            # 3. Obtener todas las actividades relacionadas al cultivo
            actividades = Actividades.objects.filter(fk_Cultivo=cultivo).select_related(
                'fk_TipoActividad',
                'fk_Usuario'
            ).prefetch_related(
                'tiempoactividadcontrol_set',
                Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida'))
            )
            
            # 4. Obtener plantaciones del cultivo
            plantaciones = cultivo.plantaciones_set.all()
            
            # 5. Obtener controles CON RELACIONES COMPLETAS 
            #    a. Obtener afecciones de las plantaciones
            afecciones_ids = Afecciones.objects.filter(
                fk_Plantacion__in=plantaciones
            ).values_list('id', flat=True)
            
            #    b. Obtener controles de esas afecciones
            controles = Controles.objects.filter(
                fk_Afeccion__in=afecciones_ids
            ).select_related(
                'fk_TipoControl', 
                'fk_Afeccion__fk_Plaga',        
                'fk_Afeccion__fk_Plaga__fk_Tipo'   
            ).prefetch_related(
                Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida'))
            )
            
            # 6. Calcular costos de insumos (actividades + controles)
            insumos_actividades = UsosInsumos.objects.filter(
                fk_Actividad__in=actividades
            ).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                
            insumos_controles = UsosInsumos.objects.filter(
                fk_Control__in=controles
            ).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
            
            total_insumos = int(round(insumos_actividades + insumos_controles))
            
            # 7. Calcular costos de mano de obra
            mano_obra_actividades = TiempoActividadControl.objects.filter(
                fk_actividad__in=actividades
            ).aggregate(total=Sum('valorTotal'))['total'] or 0
            
            mano_obra_controles = TiempoActividadControl.objects.filter(
                fk_control__in=controles
            ).aggregate(total=Sum('valorTotal'))['total'] or 0
            
            total_mano_obra = int(round(mano_obra_actividades + mano_obra_controles))
            
            # 8. Calcular ventas totales (a través de plantaciones->cosechas->ventas)
            cosechas_ids = Cosechas.objects.filter(
                fk_Plantacion__in=plantaciones
            ).values_list('id', flat=True)
            
            ventas = Ventas.objects.filter(
                fk_Cosecha__id__in=cosechas_ids
            ).select_related('fk_UnidadMedida')
            
            total_ventas = ventas.aggregate(total=Sum('valorTotal'))['total'] or 0
            
            # 9. Construir detalle de actividades
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
                    total_insumos_actividad += insumo.costoUsoInsumo
                
                detalle_actividades.append({
                    "tipo_actividad": actividad.fk_TipoActividad.nombre if actividad.fk_TipoActividad else None,
                    "responsable": actividad.fk_Usuario.nombre if actividad.fk_Usuario else None,
                    "fecha": actividad.fecha.strftime("%Y-%m-%d"),
                    "tiempo_total": tiempos['total_tiempo'] or 0,
                    "costo_mano_obra": tiempos.get('total_valor', 0) or 0, 
                    "insumos": insumos_actividad,  
                    "total_insumos_actividad": total_insumos_actividad  
                })
            
            # 10. Construir detalle de controles
            detalle_controles = []
            for control in controles:
                tiempo_control = TiempoActividadControl.objects.filter(fk_control=control).aggregate(
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
                    total_insumos_control += insumo.costoUsoInsumo
                
                detalle_controles.append({
                    "descripcion": control.descripcion,
                    "fecha": control.fechaControl.strftime("%Y-%m-%d"),
                    "tipo_control": control.fk_TipoControl.nombre if control.fk_TipoControl else None,
                    "plaga": control.fk_Afeccion.fk_Plaga.nombre if control.fk_Afeccion.fk_Plaga else None,
                    "tipo_plaga": control.fk_Afeccion.fk_Plaga.fk_Tipo.nombre if control.fk_Afeccion.fk_Plaga else None,
                    "tiempo_total": tiempo_control['total_tiempo'] or 0,
                    "costo_mano_obra": tiempo_control['total_valor'] or 0,
                    "insumos": insumos_control,  
                    "total_insumos_control": total_insumos_control  
                })
            
            # 11. Construir detalle de cosechas y ventas
            detalle_cosechas = []
            for plantacion in plantaciones:
                for cosecha in plantacion.cosechas_set.all():
                    detalle_cosechas.append({
                        "cantidad": cosecha.cantidad,
                        "unidad": cosecha.fk_UnidadMedida.nombre if cosecha.fk_UnidadMedida else None,
                        "fecha": cosecha.fecha.strftime("%Y-%m-%d"),
                        "plantacion_id": plantacion.id
                    })
            
            detalle_ventas = [{
                "cantidad": venta.cantidad,
                "unidad": venta.fk_UnidadMedida.nombre if venta.fk_UnidadMedida else None,
                "fecha": venta.fecha.strftime("%Y-%m-%d"),
                "valor_total": venta.valorTotal,
                "cosecha_id": venta.fk_Cosecha.id if venta.fk_Cosecha else None
            } for venta in ventas]
            
            # 12. Calcular métricas finales
            total_costos = total_insumos + total_mano_obra
            beneficio = total_ventas - total_costos
            relacion_bc = round(total_ventas / total_costos, 2) if total_costos > 0 else 0
            
            # 13. Obtener fecha de siembra (del semillero o plantación más antigua)
            primer_semillero = cultivo.semilleros_set.order_by('fechasiembra').first()
            primera_plantacion = plantaciones.order_by('fechaSiembra').first()
            
            fecha_siembra = (
                primer_semillero.fechasiembra if primer_semillero else
                primera_plantacion.fechaSiembra if primera_plantacion else
                None
            )
            
            # 14. Estructurar respuesta
            data = {
                "cultivo_id": cultivo.id,
                "nombre_especie": nombre_especie,
                "nombre_cultivo": cultivo.nombre,
                "fecha_siembra": fecha_siembra.strftime("%Y-%m-%d") if fecha_siembra else None,
                "total_insumos": total_insumos,
                "total_mano_obra": total_mano_obra,
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
                        "total": ventas.count(),
                        "ventas_detalladas": detalle_ventas
                    }
                }
            }
            
            return Response(data)
            
        except Cultivos.DoesNotExist:
            return Response(
                {"error": "Cultivo no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error al obtener resumen: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )