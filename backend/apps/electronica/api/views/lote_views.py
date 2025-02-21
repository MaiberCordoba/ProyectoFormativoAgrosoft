from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.electronica.api.models.lote import Lote
from apps.electronica.api.models.sensor import Sensor
from apps.electronica.api.serializers.Lote_Serializer import LoteSerializer
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
import math

class LoteView(ModelViewSet):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def calcular_evapotranspiracion(self, request, pk=None):
        try:
            lote = self.get_object()
            evapotranspiracion = self._calcular_evapotranspiracion(lote)

            return Response(
                {"lote": lote.nombre, "evapotranspiracion": evapotranspiracion},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _calcular_evapotranspiracion(self, lote):
        try:
            temperatura = Decimal(lote.sensores.filter(tipo='TEM').latest('fecha').valor)
            humedad_relativa = Decimal(lote.sensores.filter(tipo='HUM_A').latest('fecha').valor)
            radiacion_solar = Decimal(lote.sensores.filter(tipo='LUM').latest('fecha').valor)
            velocidad_viento = Decimal(lote.sensores.filter(tipo='VIE').latest('fecha').valor)

            velocidad_viento = velocidad_viento * Decimal(1000) / Decimal(3600)  
            radiacion_solar = radiacion_solar * Decimal(0.0864)

            elevacion = Decimal(1000)

            es = Decimal(0.6108) * (Decimal(2.718281828459045) ** ((Decimal(17.27) * temperatura) / (temperatura + Decimal(237.3))))
            ea = es * (humedad_relativa / Decimal(100))

            delta = (Decimal(4098) * es) / ((temperatura + Decimal(237.3)) ** 2)

            gamma = Decimal(0.665 * 10 ** -3) * (Decimal(101.3) * ((Decimal(293) - (Decimal(0.0065) * elevacion)) / Decimal(293)) ** Decimal(5.26))

            ET0 = (Decimal(0.408) * delta * radiacion_solar +
                   gamma * (Decimal(900) / (temperatura + Decimal(273))) * velocidad_viento * (es - ea)) / \
                  (delta + gamma * (Decimal(1) + Decimal(0.34) * velocidad_viento))

            return round(ET0, 2)
        except Sensor.DoesNotExist:
            return "No hay datos suficientes para calcular la evapotranspiración."