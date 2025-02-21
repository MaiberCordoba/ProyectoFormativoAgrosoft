from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.electronica.api.serializers.Lote_Serializer import *
from apps.electronica.api.models.sensor import *

class SensorSerializer(ModelSerializer):
    fk_lote = LoteSerializer(read_only=True)
    fk_lote_id = serializers.PrimaryKeyRelatedField(
        queryset=Lote.objects.all(), source='fk_lote', write_only=True
    )
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Sensor
        fields = ['id', 'fk_lote', 'fk_lote_id', 'fecha', 'tipo', 'tipo_display', 'valor']