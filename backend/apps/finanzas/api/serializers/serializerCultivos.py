from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.cultivos import Cultivos

class SerializerCultivos(ModelSerializer):
    class Meta:
        model = Cultivos
        fields = '__all__'
