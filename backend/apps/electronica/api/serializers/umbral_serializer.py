from rest_framework.serializers import ModelSerializer
from apps.electronica.api.models.umbral import *
from apps.electronica.api.serializers.Sensor_Serializer import *
from rest_framework import serializers


class UmbralSerializer(serializers.ModelSerializer):
    sensor = SensorSerializer(read_only=True)
    sensor_id = serializers.PrimaryKeyRelatedField(
        queryset=Sensor.objects.all(), source='sensor', write_only=True
    )

    class Meta:
        model = Umbral
        fields = ['id', 'sensor', 'sensor_id', 'valor_minimo', 'valor_maximo']

    def validate(self, data):
        if data.get('valor_minimo') >= data.get('valor_maximo'):
            raise serializers.ValidationError("El valor mínimo debe ser menor al valor máximo.")
        return data
