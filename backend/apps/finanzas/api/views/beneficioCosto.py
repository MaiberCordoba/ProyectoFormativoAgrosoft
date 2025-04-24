from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.ventas import Ventas

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
            # 1. Obtener el cultivo con su semillero y relaciones anidadas
            cultivo = Cultivos.objects.select_related(
                'fk_Semillero',
                'fk_Semillero__fk_especie'  # Asumiendo que el semillero tiene FK a Especie
            ).get(pk=pk)
            
            # 2. Obtener nombre y variedad directamente de la especie
            nombre_especie = cultivo.fk_Semillero.fk_especie.nombre if cultivo.fk_Semillero.fk_especie else None
            
            # 4. Obtener todas las actividades relacionadas al cultivo
            actividades = Actividades.objects.filter(fk_Cultivo=cultivo).select_related(
                'fk_TipoActividad',
                'fk_Usuario'
            ).prefetch_related('tiempoactividadcontrol_set','usosinsumos_set__fk_UnidadMedida')  # ← Relación inversa para tiempos
            
            # 5. Obtener controles CON RELACIONES COMPLETAS 
            #    a. Primero obtenemos las plantaciones del cultivo
            plantaciones_ids = Plantaciones.objects.filter(fk_Cultivo=cultivo).values_list('id', flat=True)
            
            #    b. Luego obtenemos las afecciones de esas plantaciones
            afecciones_ids = Afecciones.objects.filter(fk_Plantacion__in=plantaciones_ids).values_list('id', flat=True)
            
            #    c. Finalmente obtenemos los controles de esas afecciones
            controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids).select_related(
                'fk_TipoControl', 
                'fk_Afeccion__fk_Plaga',        
                'fk_Afeccion__fk_Plaga__fk_Tipo'   
            ).prefetch_related(
                'usosinsumos_set__fk_UnidadMedida' 
            )
            
            # 6. Calcular costos de insumos (actividades + controles)
            #    a. Insumos usados en actividades
            insumos_actividades = UsosInsumos.objects.filter(
                fk_Actividad__in=actividades,
                fk_Actividad__isnull=False
            ).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                
            #    b. Insumos usados en controles
            insumos_controles = UsosInsumos.objects.filter(
                fk_Control__in=controles,
                fk_Control__isnull=False
            ).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
            
            total_insumos = int(round(insumos_actividades + insumos_controles))
            
            # 5. Calcular costos de mano de obra
            #    a. Mano de obra en actividades
            mano_obra_actividades = TiempoActividadControl.objects.filter(
                fk_actividad__in=actividades,
                fk_actividad__isnull=False
            ).aggregate(total=Sum('valorTotal'))['total'] or 0
            
            #    b. Mano de obra en controles
            mano_obra_controles = TiempoActividadControl.objects.filter(
                fk_control__in=controles,
                fk_control__isnull=False
            ).aggregate(total=Sum('valorTotal'))['total'] or 0
            
            total_mano_obra = int(round(mano_obra_actividades + mano_obra_controles))
            
            # 6. Calcular ventas totales del cultivo
            cosechas = Cosechas.objects.filter(fk_Cultivo=cultivo).select_related('fk_UnidadMedida') 
            ventas = Ventas.objects.filter(fk_Cosecha__in=cosechas).select_related('fk_UnidadMedida')
            total_ventas = Ventas.objects.filter(
                fk_Cosecha__in=cosechas
            ).aggregate(total=Sum('valorTotal'))['total'] or 0
            
             # 5. Construir detalle de actividades
            detalle_actividades = []
            for actividad in actividades:
                # Tiempos y costos de mano de obra
                tiempos = actividad.tiempoactividadcontrol_set.all().aggregate(
                    total_tiempo=Sum('tiempo'),
                    total_valor=Sum('valorTotal')
                )
                
                # Insumos usados en la actividad
                insumos_actividad = []
                total_insumos_actividad = 0
                for insumo in actividad.usosinsumos_set.all():
                    insumos_actividad.append({
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
                    "costo_mano_obra": tiempos['total_valor'] or 0,
                    "insumos": insumos_actividad,  
                    "total_insumos_actividad": total_insumos_actividad  
                })
            
            # 6. Construir detalle de controles
            detalle_controles = []
            for control in controles:
                # Tiempos y costos de mano de obra
                tiempo_control = TiempoActividadControl.objects.filter(fk_control=control).aggregate(
                    total_tiempo=Sum('tiempo'),
                    total_valor=Sum('valorTotal')
                )
                
                # Insumos usados en el control
                insumos_control = []
                total_insumos_control = 0
                for insumo in control.usosinsumos_set.all():
                    insumos_control.append({
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
            
            # 7. Construir detalle de cosechas y ventas
            detalle_cosechas = [{
                "cantidad": cosecha.cantidad,
                "unidad": cosecha.fk_UnidadMedida.nombre if cosecha.fk_UnidadMedida else None,
                "fecha": cosecha.fecha.strftime("%Y-%m-%d")
            } for cosecha in cosechas]
            
            detalle_ventas = [{
                "cantidad": venta.cantidad,
                "unidad": venta.fk_UnidadMedida.nombre if venta.fk_UnidadMedida else None,
                "fecha": venta.fecha.strftime("%Y-%m-%d"),
                "valor_total": venta.valorTotal
            } for venta in ventas]
            
            # 7. Calcular métricas finales
            total_costos = total_insumos + total_mano_obra
            beneficio = total_ventas - total_costos
            relacion_bc = round(total_ventas / total_costos,2) if total_costos > 0 else 0
            
            # 8. Estructurar respuesta
            data = {
                "cultivo_id": cultivo.id,
                "fecha_siembra": cultivo.fechaSiembra.strftime("%Y-%m-%d") if cultivo.fechaSiembra else None,
                "unidades": cultivo.unidades,
                "nombre": nombre_especie,
                "total_insumos": total_insumos,
                "total_mano_obra": total_mano_obra,
                "total_costos": total_costos,
                "total_ventas": total_ventas,
                "beneficio": beneficio,
                "relacion_beneficio_costo": round(relacion_bc, 2),
                "detalle": {
                    "actividades": {
                        "total": actividades.count(),
                        "actividades_detalladas": detalle_actividades
                    },
                    "controles": {
                        "total": controles.count(),
                        "controles_detallados": detalle_controles
                    },
                    "cosechas":{
                        "total":cosechas.count(),
                        "cosechas_detalladas": detalle_cosechas, 
                    },
                    "ventas":{
                        "total":ventas.count(),
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
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )