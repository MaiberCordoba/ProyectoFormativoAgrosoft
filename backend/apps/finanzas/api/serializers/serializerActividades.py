from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.actividades import Actividades

class SerializerActividades(ModelSerializer):
    class Meta:
        model = Actividades
        fields = '__all__'