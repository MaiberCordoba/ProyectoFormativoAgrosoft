from rest_framework.serializers import ModelSerializer
from ..models.SemillerosModel import Semilleros
from apps.trazabilidad.api.serializers.EspeciesSerializer import EspeciesSerializer

class SemillerosSerializer(ModelSerializer):
    especie = EspeciesSerializer(source='fk_especie',read_only=True)
    class Meta:
        model = Semilleros
        fields = '__all__'