from rest_framework import serializers
from apps.finanzas.api.models.cosechaVenta import VentaCosecha

class SerializerVentaCosecha(serializers.ModelSerializer):
    class Meta:
        model = VentaCosecha
        fields = ['cosecha', 'cantidad', 'unidad_medida', 'precio_unitario', 'descuento', 'valor_total']

    def to_representation(self, instance):
        return {
            'cosecha': instance.cosecha.id,
            'cantidad': instance.cantidad,
            'unidad_medida': instance.unidad_medida.id,
            'precio_unitario': str(instance.precio_unitario),
            'descuento': str(instance.descuento),
            'valor_total': str(instance.valor_total),
        }