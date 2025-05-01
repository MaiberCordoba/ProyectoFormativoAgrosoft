from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
from datetime import timedelta
from apps.electronica.api.models.sensor import Sensor
from apps.finanzas.api.models.cultivos import Cultivos, CoeficienteCultivo

class CalcularEvapotranspiracionView(APIView):
    def get(self, request):
        cultivo_id = request.query_params.get('cultivo_id')
        lote_id = request.query_params.get('lote_id')

        if not cultivo_id or not lote_id:
            return Response({'error': 'Faltan parámetros cultivo_id o lote_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cultivo = Cultivos.objects.get(pk=cultivo_id)
            kc = CoeficienteCultivo.objects.filter(cultivo=cultivo).last()
            kc_valor = kc.kc_valor if kc else 0.7  # Valor por defecto

            ahora = now()
            hace_24_horas = ahora - timedelta(hours=24)

            temperatura = Sensor.objects.filter(
                tipo='TEM',
                fk_lote=lote_id,
                fecha__range=(hace_24_horas, ahora)
            ).order_by('-fecha').first()

            viento = Sensor.objects.filter(
                tipo='VIE',
                fk_lote=lote_id,
                fecha__range=(hace_24_horas, ahora)
            ).order_by('-fecha').first()

            iluminacion = Sensor.objects.filter(
                tipo='LUM',
                fk_lote=lote_id,
                fecha__range=(hace_24_horas, ahora)
            ).order_by('-fecha').first()

            humedad = Sensor.objects.filter(
                tipo='HUM_A',
                fk_lote=lote_id,
                fecha__range=(hace_24_horas, ahora)
            ).order_by('-fecha').first()

            if not all([temperatura, viento, iluminacion, humedad]):
                return Response({'error': 'Faltan datos de sensores'}, status=status.HTTP_404_NOT_FOUND)

            # Fórmula simplificada de ETo (evapotranspiración de referencia)
            eto = (0.408 * float(temperatura.valor) + 
                   0.124 * float(iluminacion.valor) + 
                   0.19 * float(viento.valor) - 
                   0.15 * float(humedad.valor))

            # Evapotranspiración real
            et_real = eto * float(kc_valor)

            return Response({
                'evapotranspiracion_mm_dia': round(et_real, 2),
                'kc': float(kc_valor),
                'sensor_data': {
                    'temperatura': float(temperatura.valor),
                    'viento': float(viento.valor),
                    'iluminacion': float(iluminacion.valor),
                    'humedad': float(humedad.valor),
                }
            })

        except Cultivos.DoesNotExist:
            return Response({'error': 'Cultivo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
