from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.salarios import Salarios

class SerializerSalarios(ModelSerializer):
    class Meta:
        model = Salarios
        field = '__all__'