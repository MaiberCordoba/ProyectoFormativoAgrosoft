from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from apps.electronica.api.models.sensor import Sensor
from apps.electronica.api.serializers.Sensor_Serializer import SensorSerializer

class SensoresView(ModelViewSet):
    queryset = Sensor.objects.all().order_by('-fecha')
    serializer_class = SensorSerializer
    filterset_fields = ['tipo', 'fk_lote', 'fk_eras']

class SensorHistoryView(APIView):
    def get(self, request, pk=None, format=None):
        hours = request.query_params.get('hours')
        sensor_type = request.query_params.get('type')
        lote_id = request.query_params.get('lote_id')
        era_id = request.query_params.get('era_id')
        limit = request.query_params.get('limit', 100) 
        
        queryset = Sensor.objects.all()
        
        if pk: 
            try:
                sensor = Sensor.objects.get(pk=pk)
                queryset = queryset.filter(id=pk)
            except Sensor.DoesNotExist:
                return Response({"error": "Sensor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        if sensor_type:
            queryset = queryset.filter(tipo=sensor_type)
            
        if lote_id:
            queryset = queryset.filter(fk_lote_id=lote_id)
            
        if era_id:
            queryset = queryset.filter(fk_eras_id=era_id)
            
        if hours:
            try:
                hours = int(hours)
                time_threshold = timezone.now() - timedelta(hours=hours)
                queryset = queryset.filter(fecha__gte=time_threshold)
            except ValueError:
                return Response({"error": "Parámetro 'hours' debe ser un número entero"}, status=status.HTTP_400_BAD_REQUEST)

        data = list(queryset.order_by('-fecha')[:limit].values(
            'id', 'valor', 'fecha', 'tipo', 'umbral_minimo', 'umbral_maximo',
            'fk_lote_id', 'fk_eras_id'
        ))
        return Response(data)