from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.usosInsumos import UsosInsumos

class SerializerUsosInsumos(ModelSerializer):
    class Meta:
        model = UsosInsumos
        fields = '__all__'
