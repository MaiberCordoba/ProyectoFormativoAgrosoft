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
            data.get('fk_Usuario')
        ]
        cantidad_no_nulos = sum(1 for x in relacionados if x is not None)

        if cantidad_no_nulos > 1:
            raise serializers.ValidationError(
                "Solo puedes seleccionar uno: Insumo, Herramienta, Cosecha o Usuario."
            )
        if cantidad_no_nulos == 0:
            raise serializers.ValidationError(
                "Debes seleccionar al menos uno: Insumo, Herramienta, Cosecha o Usuario."
            )

        return data
