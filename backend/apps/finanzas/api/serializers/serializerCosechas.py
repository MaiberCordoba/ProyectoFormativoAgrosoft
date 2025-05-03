from rest_framework import serializers
from apps.finanzas.api.models.cosechas import Cosechas

class SerializerCosechas(serializers.ModelSerializer):
    cantidadTotal = serializers.FloatField(read_only=True)
    cantidadDisponible = serializers.FloatField(read_only=True)

    class Meta:
        model = Cosechas
        fields = '__all__'

    def create(self, validated_data):
        unidad = validated_data.get('fk_UnidadMedida')
        cantidad = validated_data.get('cantidad')

        if unidad:
            equivalencia = unidad.equivalenciabase
            cantidad_total = cantidad * equivalencia
            validated_data['cantidadTotal'] = cantidad_total
        return super().create(validated_data)

    def update(self, instance, validated_data):
        unidad = validated_data.get('fk_UnidadMedida', instance.fk_UnidadMedida)
        cantidad = validated_data.get('cantidad', instance.cantidad)

        if unidad:
            equivalencia = unidad.equivalenciabase
            cantidad_total = cantidad * equivalencia
            validated_data['cantidadTotal'] = cantidad_total

        return super().update(instance, validated_data)
