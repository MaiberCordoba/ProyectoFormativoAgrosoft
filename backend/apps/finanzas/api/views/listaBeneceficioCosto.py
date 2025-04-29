from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q, Prefetch
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.ventas import Ventas

class ListCultivoEconomicViewSet(viewsets.ViewSet):
    """
    ViewSet para operaciones económicas de cultivos
    Incluye endpoints para:
    - Listado de resúmenes económicos de todos los cultivos
    - Resumen económico detallado de un cultivo específico
    """
    
    @action(detail=False, methods=['get'],)
    def resumen_economico(self, request):
        """
        Obtiene un listado con los resúmenes económicos básicos de todos los cultivos
        ---
        Retorna:
        - Lista de cultivos con:
          * ID
          * Nombre de especie
          * Fecha de siembra
          * Costos totales
          * Ventas totales
          * Beneficio
          * Relación B/C
        """
        try:
            # Optimización de queries con prefetch_related y select_related
            cultivos = Cultivos.objects.select_related(
                'fk_Semillero',
                'fk_Semillero__fk_especie'
            ).prefetch_related(
                Prefetch('actividades_set', queryset=Actividades.objects.all()),
                Prefetch('cosechas_set', queryset=Cosechas.objects.all())
            ).all()
            
            resumenes = []
            
            for cultivo in cultivos:
                # 1. Obtener nombre de la especie
                nombre_especie = cultivo.fk_Semillero.fk_especie.nombre if cultivo.fk_Semillero and cultivo.fk_Semillero.fk_especie else None
                
                # 2. Obtener actividades relacionadas al cultivo
                actividades = cultivo.actividades_set.all()
                
                # 3. Obtener controles relacionados indirectamente
                plantaciones_ids = Plantaciones.objects.filter(
                    fk_Cultivo=cultivo
                ).values_list('id', flat=True)
                
                afecciones_ids = Afecciones.objects.filter(
                    fk_Plantacion__in=plantaciones_ids
                ).values_list('id', flat=True)
                
                controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids)
                
                # 4. Calcular costos de insumos
                insumos_actividades = UsosInsumos.objects.filter(
                    fk_Actividad__in=actividades
                ).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                
                insumos_controles = UsosInsumos.objects.filter(
                    fk_Control__in=controles
                ).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                
                total_insumos = int(round(insumos_actividades + insumos_controles))
                
                # 5. Calcular costos de mano de obra
                mano_obra_actividades = TiempoActividadControl.objects.filter(
                    fk_actividad__in=actividades
                ).aggregate(total=Sum('valorTotal'))['total'] or 0
                
                mano_obra_controles = TiempoActividadControl.objects.filter(
                    fk_control__in=controles
                ).aggregate(total=Sum('valorTotal'))['total'] or 0
                
                total_mano_obra = int(round(mano_obra_actividades + mano_obra_controles))
                
                # 6. Calcular ventas totales
                cosechas = cultivo.cosechas_set.all()
                total_ventas = Ventas.objects.filter(
                    fk_Cosecha__in=cosechas
                ).aggregate(total=Sum('valorTotal'))['total'] or 0
                
                # 7. Calcular métricas básicas
                total_costos = total_insumos + total_mano_obra
                beneficio = total_ventas - total_costos
                relacion_bc = round(total_ventas / total_costos, 2) if total_costos > 0 else 0
                
                # 8. Estructurar respuesta básica
                resumen = {
                    "cultivo_id": cultivo.id,
                    "nombre_especie": nombre_especie,
                    "fecha_siembra": cultivo.fechaSiembra.strftime("%Y-%m-%d") if cultivo.fechaSiembra else None,
                    "costo_insumos":total_insumos,
                    "total_mano_obra":total_mano_obra,
                    "total_costos": total_costos,
                    "total_ventas": total_ventas,
                    "beneficio": beneficio,
                    "relacion_beneficio_costo": relacion_bc
                }
                
                resumenes.append(resumen)
            
            return Response(resumenes)
            
        except Exception as e:
            return Response(
                {"error": f"Error al obtener resúmenes: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )