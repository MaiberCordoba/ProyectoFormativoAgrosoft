from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.cosechas import Cosechas

class SerializerCosechas(ModelSerializer):
    class Meta:
        model = Cosechas
        fields = '__all__'
    