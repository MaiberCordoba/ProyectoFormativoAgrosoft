from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.insumos import Insumos

class SerializerInsumos(ModelSerializer):
    class Meta:
        model = Insumos
        fields = '__all__'
