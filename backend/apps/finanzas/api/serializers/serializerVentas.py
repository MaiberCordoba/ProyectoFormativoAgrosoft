from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.serializers.serializerUnidadesMedida import serializerUnidadesMedida

class SerializerVentas(ModelSerializer):
    unidadMedida = serializerUnidadesMedida(source='fk_UnidadMedida', read_only=True)
    valorTotal = serializers.IntegerField(read_only=True)
    precioUnitario = serializers.IntegerField(required=False)

    class Meta:
        model = Ventas
        fields = '__all__'

    def validate(self, data):
        cosecha = data.get('fk_Cosecha')
        unidad_medida = data.get('fk_UnidadMedida')
        cantidad = data.get('cantidad')

        if cosecha and unidad_medida and cantidad:
            cantidad_en_base = cantidad * unidad_medida.equivalenciabase

            if self.instance:
                cantidad_anterior_base = self.instance.cantidad * self.instance.fk_UnidadMedida.equivalenciabase
                cantidad_disponible_total = cosecha.cantidadTotal + cantidad_anterior_base
                if ((cantidad_en_base > cantidad_disponible_total) or (cantidad > cosecha.cantidad )):
                    raise ValidationError(
                        f"La cantidad solicitada ({cantidad_en_base}) excede la cantidad disponible ({cantidad_disponible_total})."
                    )
                if cantidad > cosecha.cantidad :
                    raise ValidationError(
                        f"La cantidad ingresada ({cantidad}) excede la cantidad cosechada ({cosecha.cantidad})"
                    )
            else:
                if cantidad_en_base > cosecha.cantidadTotal:
                    raise ValidationError(
                        f"La cantidad solicitada ({cantidad_en_base}) excede la cantidad disponible ({cosecha.cantidadTotal})."
                    )

        return data

    def create(self, validated_data):
        cosecha = validated_data.get('fk_Cosecha')
        unidad_medida = validated_data.get('fk_UnidadMedida')
        cantidad = validated_data.get('cantidad')

        if 'precioUnitario' not in validated_data or validated_data['precioUnitario'] is None:
            validated_data['precioUnitario'] = cosecha.precioReferencial

        validated_data['valorTotal'] = validated_data['precioUnitario'] * cantidad

        if cosecha and unidad_medida:
            cantidad_en_base = cantidad * unidad_medida.equivalenciabase
            cosecha.cantidadTotal -= cantidad_en_base
            cosecha.cantidad -= cantidad
            cosecha.save()

        return super().create(validated_data)

    def update(self, instance, validated_data):
        cosecha = validated_data.get('fk_Cosecha', instance.fk_Cosecha)
        unidad_medida = validated_data.get('fk_UnidadMedida', instance.fk_UnidadMedida)
        cantidad_nueva = validated_data.get('cantidad', instance.cantidad)

        cantidad_nueva_base = cantidad_nueva * unidad_medida.equivalenciabase
        cantidad_anterior_base = instance.cantidad * instance.fk_UnidadMedida.equivalenciabase

        cosecha.cantidadTotal += cantidad_anterior_base
        cosecha.cantidadTotal -= cantidad_nueva_base

        cosecha.cantidad += instance.cantidad  
        cosecha.cantidad -= cantidad_nueva    

        cosecha.save()

        precio = validated_data.get('precioUnitario', instance.precioUnitario)
        validated_data['valorTotal'] = precio * cantidad_nueva

        return super().update(instance, validated_data)

