from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.ventas import Ventas

class SerializerVentas(ModelSerializer):
    class Meta:
        model = Ventas
        fields = '__all__'
