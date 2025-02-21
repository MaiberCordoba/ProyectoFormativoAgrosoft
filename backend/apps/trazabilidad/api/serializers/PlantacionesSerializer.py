from rest_framework.serializers import ModelSerializer
from ..models.PlantacionesModel import Plantaciones

class PlantacionesSerializer(ModelSerializer):
    class Meta:
        model = Plantaciones
        fields = '__all__'