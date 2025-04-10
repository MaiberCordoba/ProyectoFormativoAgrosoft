from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl

class SerializerTiempoActividadControl(ModelSerializer):
    class Meta:
        model = TiempoActividadControl
        fields = '__all__'
