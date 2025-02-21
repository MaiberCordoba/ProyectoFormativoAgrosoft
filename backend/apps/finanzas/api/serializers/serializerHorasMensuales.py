from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.horasMensuales import HorasMensuales

class SerializerHorasMensuales(ModelSerializer):
    class Meta:
        model = HorasMensuales
        fields = "__all__"