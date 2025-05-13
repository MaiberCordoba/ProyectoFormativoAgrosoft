from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario

class SerializerUsosInsumos(ModelSerializer):
    class Meta:
        model = UsosInsumos
        fields = '__all__'

    def create(self, validated_data):
        uso = super().create(validated_data)

        # Crear registro de salida
        MovimientoInventario.objects.create(
            tipo='salida',
            fk_Insumo=uso.fk_Insumo,
            fk_UsoInsumo=uso,
            unidades=uso.cantidadProducto
        )
        return uso