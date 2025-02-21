from rest_framework.serializers import ModelSerializer
from ..models.EspeciesModel import Especies

class EspeciesSerializer(ModelSerializer):
    class Meta:
        model = Especies
        fields = '__all__'