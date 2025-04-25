from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.finanzas.api.models.ventas import Ventas

class SerializerVentas(ModelSerializer):
    valorTotal = serializers.IntegerField(read_only=True)
    precioUnitario = serializers.IntegerField(required=False)

    class Meta:
        model = Ventas
        fields = '__all__'

    def create(self, validated_data):
        cosecha = validated_data.get('fk_Cosecha')
        unidad_medida = validated_data.get('fk_UnidadMedida')
        cantidad = validated_data.get('cantidad')

        # Precio por defecto
        if 'precioUnitario' not in validated_data or validated_data['precioUnitario'] is None:
            validated_data['precioUnitario'] = cosecha.precioReferencial

        # Valor total
        validated_data['valorTotal'] = validated_data['precioUnitario'] * cantidad

        # Descontar del stock
        if cosecha and unidad_medida:
            cantidad_en_base = cantidad * unidad_medida.equivalenciabase
            cosecha.cantidadDisponible -= cantidad_en_base
            cosecha.save()

        return super().create(validated_data)

    def update(self, instance, validated_data):
        precio = validated_data.get('precioUnitario', instance.precioUnitario)
        cantidad = validated_data.get('cantidad', instance.cantidad)
        validated_data['valorTotal'] = precio * cantidad
        return super().update(instance, validated_data)
