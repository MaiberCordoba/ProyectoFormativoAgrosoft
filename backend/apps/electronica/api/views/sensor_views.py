from rest_framework.viewsets import ModelViewSet
from apps.electronica.api.models.sensor import *
from apps.electronica.api.serializers.Sensor_Serializer import *
from rest_framework.permissions import IsAuthenticated

class sensoresview(ModelViewSet):
    queryset =Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [IsAuthenticated]