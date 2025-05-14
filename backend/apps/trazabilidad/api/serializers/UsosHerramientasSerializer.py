from rest_framework.serializers import ModelSerializer,ValidationError
from ..models.UsosHerramientasModel import UsosHerramientas
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario


class UsosHerramientasSerializer(ModelSerializer):
    class Meta:
        model = UsosHerramientas
        fields = '__all__'
    
    def create(self, validated_data):
        cantidad = validated_data.get("unidades")
        herramienta = validated_data.get("fk_Herramienta")
        usoH = super().create(validated_data)

        if herramienta.unidades is None or herramienta.unidades < cantidad:
            raise ValidationError("No hay suficientes unidades disponibles de la herramienta.")

        # Descontar las unidades disponibles
        herramienta.unidades -= cantidad
        herramienta.save()

        # Crear el uso
        usoH = super().create(validated_data)

        # Registrar movimiento de salida
        MovimientoInventario.objects.create(
            tipo="salida",
            fk_Herramienta=herramienta,
            fk_UsoHerramienta=usoH,
            unidades=cantidad
        )
        return usoH