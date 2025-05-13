from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from apps.electronica.api.models.sensor import Sensor
from apps.electronica.api.serializers.Sensor_Serializer import SensorSerializer

class sensoresview(ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

class SensorHistoryView(APIView):
    def get(self, request, pk, format=None):
        hours = request.query_params.get('hours')

        try:
            sensor = Sensor.objects.get(pk=pk)
        except Sensor.DoesNotExist:
            return Response({"error": "Sensor no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        queryset = Sensor.objects.filter(id=pk)

        if hours:
            try:
                hours = int(hours)
                time_threshold = timezone.now() - timedelta(hours=hours)
                queryset = queryset.filter(fecha__gte=time_threshold)
            except ValueError:
                return Response({"error": "Parámetro 'hours' debe ser un número entero"}, status=status.HTTP_400_BAD_REQUEST)

        data = list(queryset.order_by('-fecha').values('id', 'valor', 'fecha', 'tipo'))
        return Response(data)
