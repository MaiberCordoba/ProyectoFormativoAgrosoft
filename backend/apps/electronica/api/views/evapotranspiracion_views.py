from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now, localtime
from datetime import timedelta, datetime
from django.db.models import Avg
from apps.electronica.api.models.sensor import Sensor
from apps.finanzas.api.models.cultivos import Cultivos, CoeficienteCultivo
import json

class CalcularEvapotranspiracionView(APIView):
    def get(self, request):
        cultivo_id = request.query_params.get('cultivo_id')
        lote_id = request.query_params.get('lote_id')

        if not cultivo_id or not lote_id:
            return Response(
                {'error': 'Se requieren cultivo_id y lote_id'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Obtener datos del cultivo
            cultivo = Cultivos.objects.get(pk=cultivo_id)
            kc = CoeficienteCultivo.objects.filter(cultivo=cultivo).last()
            kc_valor = kc.kc_valor if kc else 0.7

            # Obtener promedios de las últimas 24 horas
            ahora = now()
            hace_24_horas = ahora - timedelta(hours=24)

            promedios = Sensor.objects.filter(
                fk_lote=lote_id,
                fecha__range=(hace_24_horas, ahora)
            ).values('tipo').annotate(
                promedio=Avg('valor')
            )

            datos = {item['tipo']: item['promedio'] for item in promedios}

            # Verificar que tenemos todos los datos necesarios
            tipos_requeridos = ['TEM', 'VIE', 'LUM', 'HUM_A']
            if not all(tipo in datos for tipo in tipos_requeridos):
                return Response(
                    {'error': 'Datos de sensores incompletos'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Fórmula mejorada
            eto = (
                0.408 * float(datos['TEM']) + 
                0.124 * float(datos['LUM']) + 
                0.19 * float(datos['VIE']) - 
                0.15 * float(datos['HUM_A'])
            )
            et_real = eto * float(kc_valor)

            # Formatear fecha para el frontend
            fecha_calculo = localtime(ahora).strftime('%Y-%m-%dT%H:%M:%S')

            return Response({
                'fecha': fecha_calculo,
                'evapotranspiracion_mm_dia': round(et_real, 2),
                'kc': float(kc_valor),
                'sensor_data': {
                    'temperatura': round(float(datos['TEM']), 2),
                    'viento': round(float(datos['VIE']), 2),
                    'iluminacion': round(float(datos['LUM']), 2),
                    'humedad': round(float(datos['HUM_A']), 2),
                }
            })

        except Cultivos.DoesNotExist:
            return Response(
                {'error': 'Cultivo no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error inesperado: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )