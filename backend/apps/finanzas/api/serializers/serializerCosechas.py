from rest_framework import serializers
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.serializers.serializerUnidadesMedida import serializerUnidadesMedida

class SerializerCosechas(serializers.ModelSerializer):
    cantidadTotal = serializers.FloatField(read_only=True)
    cantidad_disponible = serializers.FloatField(read_only=True)
    valorTotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    valorGramo = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cosechas
        fields = '__all__'
        read_only_fields = ('cantidadTotal', 'cantidad_disponible', 'valorTotal', 'valorGramo')

    def validate(self, data):
        cantidad = data.get('cantidad')
        precioUnidad = data.get('precioUnidad')
        if cantidad is not None and cantidad < 0:
            raise serializers.ValidationError("La cantidad no puede ser negativa.")
        if precioUnidad is not None and precioUnidad < 0:
            raise serializers.ValidationError("El precio por unidad no puede ser negativo.")
        return data

    def create(self, validated_data):
        unidad = validated_data.get('fk_UnidadMedida')
        cantidad = validated_data.get('cantidad')
        precioUnidad = validated_data.get('precioUnidad')

        if unidad and cantidad is not None and precioUnidad is not None:
            validated_data['valorGramo'] = precioUnidad / unidad.equivalenciabase
            validated_data['valorTotal'] = precioUnidad * cantidad
            validated_data['cantidadTotal'] = cantidad * unidad.equivalenciabase
            validated_data['cantidad_disponible'] = validated_data['cantidadTotal']

        return super().create(validated_data)

    def update(self, instance, validated_data):
        unidad = validated_data.get('fk_UnidadMedida', instance.fk_UnidadMedida)
        cantidad = validated_data.get('cantidad', instance.cantidad)
        precioUnidad = validated_data.get('precioUnidad', instance.precioUnidad)

        # Proteger cantidad_disponible si hay ventas asociadas
        if instance.ventacosecha_set.exists():
            raise serializers.ValidationError(
                "No se puede actualizar la cantidad de la cosecha porque hay ventas asociadas."
            )

        if unidad and cantidad is not None and precioUnidad is not None:
            validated_data['valorGramo'] = precioUnidad / unidad.equivalenciabase
            validated_data['valorTotal'] = precioUnidad * cantidad
            validated_data['cantidadTotal'] = cantidad * unidad.equivalenciabase
            validated_data['cantidad_disponible'] = validated_data['cantidadTotal']

        return super().update(instance, validated_data)