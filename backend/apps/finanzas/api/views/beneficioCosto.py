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
            
            # 2. Obtener todas las actividades relacionadas al cultivo
            actividades = Actividades.objects.filter(fk_Cultivo=cultivo)
            
            # 3. Obtener controles relacionados indirectamente al cultivo
            #    a. Primero obtenemos las plantaciones del cultivo
            plantaciones_ids = Plantaciones.objects.filter(
                fk_Cultivo=cultivo
            ).values_list('id', flat=True)
            
            #    b. Luego obtenemos las afecciones de esas plantaciones
            afecciones_ids = Afecciones.objects.filter(
                fk_Plantacion__in=plantaciones_ids
            ).values_list('id', flat=True)
            
            #    c. Finalmente obtenemos los controles de esas afecciones
            controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids)
            
            # 4. Calcular costos de insumos (actividades + controles)
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
            cosechas = Cosechas.objects.filter(fk_Cultivo=cultivo)
            total_ventas = Ventas.objects.filter(
                fk_Cosecha__in=cosechas
            ).aggregate(total=Sum('valorTotal'))['total'] or 0
            
            # 7. Calcular métricas finales
            total_costos = total_insumos + total_mano_obra
            beneficio = total_ventas - total_costos
            relacion_bc = int(round(total_ventas / total_costos)) if total_costos > 0 else 0
            
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
                    "num_actividades": actividades.count(),
                    "num_controles": controles.count(),
                    "num_cosechas": cosechas.count()
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