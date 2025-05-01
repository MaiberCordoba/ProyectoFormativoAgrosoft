from rest_framework.serializers import ModelSerializer
from ..models.VariedadModel import Variedad

class VariedadSerializer(ModelSerializer):
    class Meta:
        model = Variedad
        fields = '__all__'