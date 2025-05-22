# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q, Avg
from apps.electronica.api.models.sensor import Sensor
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.cultivos import CoeficienteCultivo
import logging

logger = logging.getLogger(__name__)

class EvapotranspiracionHistoricaView(APIView):
    def get(self, request):
        plantacion_id = request.query_params.get('plantacion_id')
        dias = int(request.query_params.get('dias', 30))  # Default 30 días

        if not plantacion_id:
            return Response(
                {'error': 'Parámetro plantacion_id requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            plantacion = Plantaciones.objects.select_related(
                'fk_Cultivo', 'fk_Era__fk_lote'
            ).get(pk=plantacion_id)
            
            if not plantacion.fk_Era or not plantacion.fk_Era.fk_lote:
                return Response(
                    {'error': 'La plantación no tiene ubicación válida'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            lote = plantacion.fk_Era.fk_lote
            era = plantacion.fk_Era

            dias_desde_siembra = (timezone.now().date() - plantacion.fechaSiembra).days
            try:
                kc_obj = CoeficienteCultivo.objects.filter(
                    cultivo=plantacion.fk_Cultivo,
                    dias_desde_siembra__lte=dias_desde_siembra
                ).latest('dias_desde_siembra')
                kc = kc_obj.kc_valor
            except CoeficienteCultivo.DoesNotExist:
                kc = 0.7  

            hoy = timezone.now().date()
            resultados = []

            for i in range(dias):
                fecha_consulta = hoy - timedelta(days=i)
                
                sensores = Sensor.objects.filter(
                    Q(fk_eras=era) | Q(fk_lote=lote),
                    fecha__date=fecha_consulta,
                    tipo__in=['TEM', 'VIE', 'LUM', 'HUM_A']
                ).values('tipo').annotate(promedio=Avg('valor'))
                
                datos = {s['tipo']: s['promedio'] for s in sensores}
                
                if len(datos) == 4:  
                    eto = (
                        0.408 * datos['TEM'] + 
                        0.124 * (datos['LUM'] * 0.0864) +
                        0.19 * (datos['VIE'] * 0.277778) -
                        0.15 * datos['HUM_A']
                    )
                    et_real = max(eto * kc, 0)
                    
                    resultados.append({
                        'fecha': fecha_consulta.strftime('%Y-%m-%d'),
                        'et_mm_dia': round(et_real, 2),
                        'kc': round(kc, 2),
                        'temperatura': round(datos['TEM'], 2),
                        'humedad': round(datos['HUM_A'], 2),
                        'dias_siembra': (fecha_consulta - plantacion.fechaSiembra).days
                    })

            return Response(sorted(resultados, key=lambda x: x['fecha']))

        except Plantaciones.DoesNotExist:
            return Response(
                {'error': 'Plantación no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error histórico: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Error interno del servidor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )