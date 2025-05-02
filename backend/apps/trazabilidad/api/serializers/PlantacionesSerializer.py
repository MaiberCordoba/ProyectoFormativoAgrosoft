from rest_framework.serializers import ModelSerializer
from ..models.PlantacionesModel import Plantaciones
from  apps.finanzas.api.serializers.serializerCultivos import SerializerCultivos
from apps.electronica.api.serializers.Eras_Seralizer import ErasSerializer

class PlantacionesSerializer(ModelSerializer):
    cultivo = SerializerCultivos(source='fk_Cultivo',read_only=True)
    eras = ErasSerializer(source='fk_Era',read_only=True)
    class Meta:
        model = Plantaciones
        fields = '__all__'