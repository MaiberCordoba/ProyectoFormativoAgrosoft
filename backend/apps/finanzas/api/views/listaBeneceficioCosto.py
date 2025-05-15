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

class ListCultivoEconomicViewSet(viewsets.ViewSet):
    """
    ViewSet para operaciones económicas de cultivos
    Incluye endpoints para:
    - Listado de resúmenes económicos de todos los cultivos
    - Resumen económico detallado de un cultivo específico
    """
    
    @action(detail=False, methods=['get'])
    def resumen_economico(self, request):
        """
        Obtiene un listado con los resúmenes económicos básicos de todos los cultivos
        """
        try:
            # Prefetch de objetos relacionados correctamente configurado
            prefetch_plantaciones = Prefetch(
                'plantaciones_set',
                queryset=Plantaciones.objects.prefetch_related(
                    Prefetch('cosechas_set', queryset=Cosechas.objects.all())
                )
            )
            
            cultivos = Cultivos.objects.select_related(
                'fk_Especie'
            ).prefetch_related(
                'actividades_set',
                'semilleros_set',
                prefetch_plantaciones
            ).all()
            
            resumenes = []
            
            for cultivo in cultivos:
                # 1. Obtener información básica del cultivo
                nombre_especie = cultivo.fk_Especie.nombre if cultivo.fk_Especie else None
                
                # 2. Obtener actividades relacionadas
                actividades = cultivo.actividades_set.all()
                
                # 3. Obtener plantaciones relacionadas
                plantaciones = cultivo.plantaciones_set.all()
                
                # 4. Obtener controles relacionados a través de afecciones
                afecciones_ids = Afecciones.objects.filter(
                    fk_Plantacion__in=plantaciones
                ).values_list('id', flat=True)
                
                controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids)
                
                # 5. Calcular costos de insumos
                insumos_actividades = UsosInsumos.objects.filter(
                    fk_Actividad__in=actividades
                ).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                
                insumos_controles = UsosInsumos.objects.filter(
                    fk_Control__in=controles
                ).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                
                total_insumos = int(round(insumos_actividades + insumos_controles))
                
                # 6. Calcular costos de mano de obra
                mano_obra_actividades = TiempoActividadControl.objects.filter(
                    fk_actividad__in=actividades
                ).aggregate(total=Sum('valorTotal'))['total'] or 0
                
                mano_obra_controles = TiempoActividadControl.objects.filter(
                    fk_control__in=controles
                ).aggregate(total=Sum('valorTotal'))['total'] or 0
                
                total_mano_obra = int(round(mano_obra_actividades + mano_obra_controles))
                
                # 7. Calcular ventas totales (a través de plantaciones->cosechas->ventas)
                cosechas_ids = Cosechas.objects.filter(
                    fk_Plantacion__in=plantaciones
                ).values_list('id', flat=True)
                
                total_ventas = Ventas.objects.filter(
                    fk_Cosecha__id__in=cosechas_ids
                ).aggregate(total=Sum('valorTotal'))['total'] or 0
                
                # 8. Calcular métricas financieras
                total_costos = total_insumos + total_mano_obra
                beneficio = total_ventas - total_costos
                relacion_bc = round(total_ventas / total_costos, 2) if total_costos > 0 else 0
                
                # 9. Obtener fecha de siembra (del semillero o plantación más antigua)
                primer_semillero = cultivo.semilleros_set.order_by('fechasiembra').first()
                primera_plantacion = plantaciones.order_by('fechaSiembra').first()
                
                fecha_siembra = (
                    primer_semillero.fechasiembra if primer_semillero else
                    primera_plantacion.fechaSiembra if primera_plantacion else
                    None
                )
                
                # 10. Construir respuesta
                resumen = {
                    "cultivo_id": cultivo.id,
                    "nombre_especie": nombre_especie,
                    "nombre_cultivo": cultivo.nombre,
                    "fecha_siembra": fecha_siembra.strftime("%Y-%m-%d") if fecha_siembra else None,
                    "costo_insumos": total_insumos,
                    "total_mano_obra": total_mano_obra,
                    "total_costos": total_costos,
                    "total_ventas": int(round(total_ventas)),
                    "beneficio": int(round(beneficio)),
                    "relacion_beneficio_costo": relacion_bc
                }
                
                resumenes.append(resumen)
            
            return Response(resumenes)
            
        except Exception as e:
            return Response(
                {"error": f"Error al obtener resúmenes: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )