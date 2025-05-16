from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
from datetime import timedelta
from apps.electronica.api.models.sensor import Sensor
from apps.finanzas.api.models.cultivos import Cultivos, CoeficienteCultivo

class EvapotranspiracionHistoricaView(APIView):
    def get(self, request):
        cultivo_id = request.query_params.get('cultivo_id')
        lote_id = request.query_params.get('lote_id')

        if not cultivo_id or not lote_id:
            return Response({'error': 'Faltan parámetros cultivo_id o lote_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cultivo = Cultivos.objects.get(pk=cultivo_id)
            kc_obj = CoeficienteCultivo.objects.filter(cultivo=cultivo).last()
            kc = kc_obj.kc_valor if kc_obj else 0.7

            dias = 7  # Últimos 7 días
            hoy = now().date()
            resultados = []

            for i in range(dias):
                dia_inicio = hoy - timedelta(days=i+1)
                dia_fin = hoy - timedelta(days=i)

                sensores = {
                    'temperatura': Sensor.objects.filter(tipo='TEM', fk_lote=lote_id, fecha__date__range=(dia_inicio, dia_fin)).last(),
                    'viento': Sensor.objects.filter(tipo='VIE', fk_lote=lote_id, fecha__date__range=(dia_inicio, dia_fin)).last(),
                    'iluminacion': Sensor.objects.filter(tipo='LUM', fk_lote=lote_id, fecha__date__range=(dia_inicio, dia_fin)).last(),
                    'humedad': Sensor.objects.filter(tipo='HUM_A', fk_lote=lote_id, fecha__date__range=(dia_inicio, dia_fin)).last(),
                }

                if all(sensores.values()):
                    eto = (
                        0.408 * float(sensores['temperatura'].valor) +
                        0.124 * float(sensores['iluminacion'].valor) +
                        0.19 * float(sensores['viento'].valor) -
                        0.15 * float(sensores['humedad'].valor)
                    )
                    et_real = eto * kc

                    resultados.append({
                        'fecha': dia_fin.strftime('%Y-%m-%d'),
                        'et_mm_dia': round(et_real, 2),
                    })

            return Response(resultados)

        except Cultivos.DoesNotExist:
            return Response({'error': 'Cultivo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
