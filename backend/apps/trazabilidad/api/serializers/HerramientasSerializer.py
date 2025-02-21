from rest_framework.serializers import ModelSerializer
from ..models.HerramientasModel import Herramientas

class HerramientasSerializer(ModelSerializer):
    class Meta:
        model = Herramientas
        fields = '__all__'