from rest_framework.serializers import ModelSerializer
from ..models.HerramientasModel import Herramientas
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario

class HerramientasSerializer(ModelSerializer):
    class Meta:
        model = Herramientas
        fields = '__all__'

    def create(self, validated_data):
        cantidad = validated_data.get('unidades')
        herramienta = super().create(validated_data)

        MovimientoInventario.objects.create(
            tipo = "entrada",
            fk_Herramienta = herramienta,
            unidades = cantidad
        )
        return herramienta