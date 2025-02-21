from rest_framework.serializers import ModelSerializer
from ..models.UsosHerramientasModel import UsosHerramientas

class UsosHerramientasSerializer(ModelSerializer):
    class Meta:
        model = UsosHerramientas
        fields = '__all__'