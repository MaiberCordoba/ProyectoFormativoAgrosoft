from rest_framework import serializers
from apps.electronica.api.models.umbral import Umbral
from apps.electronica.api.serializers.Sensor_Serializer import SensorSerializer
from apps.electronica.api.models.sensor import Sensor

class UmbralSerializer(serializers.ModelSerializer):
    sensor = SensorSerializer(read_only=True)
    sensor_id = serializers.PrimaryKeyRelatedField(
        queryset=Sensor.objects.all(), source='sensor', write_only=True
    )

    class Meta:
        model = Umbral
        fields = ['id', 'sensor', 'sensor_id', 'valor_minimo', 'valor_maximo']

    def validate(self, data):
        valor_minimo = data.get('valor_minimo')
        valor_maximo = data.get('valor_maximo')
        if valor_minimo is not None and valor_maximo is not None:
            if valor_minimo >= valor_maximo:
                raise serializers.ValidationError("El valor mínimo debe ser menor al valor máximo.")
        return data
