from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl

class SerializerTiempoActividadControl(ModelSerializer):
    valorTotal = serializers.FloatField(read_only=True)

    class Meta:
        model = TiempoActividadControl
        fields = '__all__'

    def validate(self, data):
        actividad = data.get('fk_actividad')
        control = data.get('fk_control')

        if actividad and control:
            raise serializers.ValidationError("Solo puede relacionarse con una actividad O un control, no ambos.")
        if not actividad and not control:
            raise serializers.ValidationError("Debe seleccionar una actividad O un control.")

        return data

    def create(self, validated_data):
        unidad = validated_data.get('fk_unidadTiempo')
        salario = validated_data.get('fk_salario')
        tiempo = validated_data.get('tiempo')

        minutos = tiempo * unidad.equivalenciaMinutos
        validated_data['valorTotal'] = minutos * salario.monto_minutos

        return super().create(validated_data)

    def update(self, instance, validated_data):
        unidad = validated_data.get('fk_unidadTiempo', instance.fk_unidadTiempo)
        salario = validated_data.get('fk_salario', instance.fk_salario)
        tiempo = validated_data.get('tiempo', instance.tiempo)

        minutos = tiempo * unidad.equivalenciaMinutos
        validated_data['valorTotal'] = minutos * salario.monto_minutos

        return super().update(instance, validated_data)