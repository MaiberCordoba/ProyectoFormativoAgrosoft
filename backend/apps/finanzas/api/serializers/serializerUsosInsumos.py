from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.finanzas.api.models.usosInsumos import UsosInsumos

class SerializerUsosInsumos(ModelSerializer):
    costoUsoInsumo = serializers.FloatField(read_only=True)

    class Meta:
        model = UsosInsumos
        fields = '__all__'

    def validate(self, data):
        actividad = data.get('fk_Actividad')
        control = data.get('fk_Control')

        if actividad and control:
            raise serializers.ValidationError("Solo se puede relacionar con una actividad o un control, no ambos.")
        if not actividad and not control:
            raise serializers.ValidationError("Debe relacionarse con una actividad o un control.")

        return data

    def create(self, validated_data):
        insumo = validated_data.get('fk_Insumo')
        unidad = validated_data.get('fk_UnidadMedida')
        cantidad = validated_data.get('cantidadProducto')

        cantidad_base = cantidad * unidad.equivalenciabase
        costo = (cantidad_base * insumo.valorTotalInsumos) / insumo.cantidadTotal
        validated_data['costoUsoInsumo'] = costo

        # Resta del stock si es nuevo
        insumo.cantidadDisponible -= cantidad_base
        insumo.save()

        return super().create(validated_data)

    def update(self, instance, validated_data):
        insumo = validated_data.get('fk_Insumo', instance.fk_Insumo)
        unidad = validated_data.get('fk_UnidadMedida', instance.fk_UnidadMedida)
        cantidad = validated_data.get('cantidadProducto', instance.cantidadProducto)

        cantidad_base = cantidad * unidad.equivalenciabase
        costo = (cantidad_base * insumo.valorTotalInsumos) / insumo.cantidadTotal
        validated_data['costoUsoInsumo'] = costo

        return super().update(instance, validated_data)