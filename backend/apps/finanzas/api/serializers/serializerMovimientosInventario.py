from rest_framework import serializers
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario

class SerializerMovimientoInventario(serializers.ModelSerializer):
    class Meta:
        model = MovimientoInventario
        fields = '__all__'

    def validate(self, data):
        relacionados = [
            data.get('fk_Insumo'),
            data.get('fk_Herramienta'),
            data.get('fk_Cosecha'),
        ]
        cantidad_no_nulos = sum(1 for x in relacionados if x is not None)

        if cantidad_no_nulos > 1:
            raise serializers.ValidationError(
                "Solo puedes seleccionar uno: Insumo, Herramienta o Cosecha."
            )
        if cantidad_no_nulos == 0:
            raise serializers.ValidationError(
                "Debes seleccionar al menos uno: Insumo, Herramienta o Cosecha."
            )

        return data

    def create(self, validated_data):
        tipo = validated_data.get('tipo')
        cantidad = validated_data.get('cantidad')

        insumo = validated_data.get('fk_Insumo')
        herramienta = validated_data.get('fk_Herramienta')
        cosecha = validated_data.get('fk_Cosecha')

        if insumo:
            if tipo == 'entrada':
                insumo.cantidadTotal += cantidad
                insumo.cantidadDisponible += cantidad
            elif tipo == 'salida':
                if insumo.cantidadDisponible < cantidad:
                    raise serializers.ValidationError("No hay suficiente stock disponible en insumos.")
                insumo.cantidadTotal -= cantidad
                insumo.cantidadDisponible -= cantidad
            insumo.save()

        elif herramienta:
            if tipo == 'entrada':
                herramienta.unidades += cantidad
            elif tipo == 'salida':
                if herramienta.unidades < cantidad:
                    raise serializers.ValidationError("No hay suficientes unidades disponibles.")
                herramienta.unidades -= cantidad
            herramienta.save()

        elif cosecha:
            if tipo == 'entrada':
                cosecha.cantidadDisponible += cantidad
            elif tipo == 'salida':
                if cosecha.cantidadDisponible < cantidad:
                    raise serializers.ValidationError("No hay suficiente cantidad disponible en la cosecha.")
                cosecha.cantidadDisponible -= cantidad
            cosecha.save()

        return super().create(validated_data)
