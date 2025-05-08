from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.insumos import Insumos
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario

class SerializerInsumos(ModelSerializer):
    class Meta:
        model = Insumos
        fields = '__all__'
        read_only_fields = ["valorTotalInsumos"]

    def create(self, validated_data):
        # Calcular valor total antes de crear
        precio = validated_data.get('precio', 0)
        unidades = validated_data.get('unidades', 0)
        valor_total = precio * unidades
        validated_data['valorTotalInsumos'] = valor_total

        insumo = super().create(validated_data)

        # Crear registro de entrada
        MovimientoInventario.objects.create(
            tipo='entrada',
            fk_Insumo=insumo,
            unidades=unidades
        )
        return insumo
