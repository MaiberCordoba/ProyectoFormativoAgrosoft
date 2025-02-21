from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.usosProductos import UsosProductos

class SerializerUsosProductos(ModelSerializer):
    class Meta:
        model = UsosProductos
        fields = '__all__'
