from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.serializers.serializerTiempoActividadControl import SerializerTiempoActividadControl 

class ViewTiempoActividadControl(ModelViewSet):
    queryset = TiempoActividadControl.objects.all()
    serializer_class = SerializerTiempoActividadControl
