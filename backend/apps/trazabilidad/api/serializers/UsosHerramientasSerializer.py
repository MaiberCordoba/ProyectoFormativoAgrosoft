from rest_framework.serializers import ModelSerializer
from ..models.UsosHerramientasModel import UsosHerramientas
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario


class UsosHerramientasSerializer(ModelSerializer):
    class Meta:
        model = UsosHerramientas
        fields = '__all__'
    
    def create(self, validated_data):
        cantidad = validated_data.get("unidades")
        usoH = super().create(validated_data)

        MovimientoInventario.objects.create(
            tipo = "salida",
            fk_UsoHerramienta = usoH,
            unidades = cantidad
        )
        return usoH