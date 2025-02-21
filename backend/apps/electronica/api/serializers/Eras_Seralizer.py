from rest_framework.serializers import ModelSerializer
from apps.electronica.api.models.era import *
from apps.electronica.api.serializers.Lote_Serializer import *
from rest_framework import serializers


class ErasSerializer(ModelSerializer):
    fk_lote = LoteSerializer(read_only=True)
    fk_lote_id = serializers.PrimaryKeyRelatedField(
        queryset=Lote.objects.all(), source='fk_lote', write_only=True
    )

    class Meta:
        model = Eras
        fields = ['id', 'fk_lote', 'fk_lote_id', 'tipo', 'tamX', 'tamY', 'posX', 'posY']

