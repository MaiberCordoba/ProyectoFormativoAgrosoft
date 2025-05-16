from rest_framework.serializers import ModelSerializer
from ..models.HerramientasModel import Herramientas
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario

class HerramientasSerializer(ModelSerializer):
    class Meta:
        model = Herramientas
        fields = '__all__'

    def create(self, validated_data):
        nombre = validated_data.get('nombre')
        nuevas_unidades = validated_data.get('unidades', 0)

        herramienta_existente = Herramientas.objects.filter(nombre=nombre).first()

        if herramienta_existente:
            herramienta_existente.unidades += nuevas_unidades
            herramienta_existente.save()

            MovimientoInventario.objects.create(
                tipo='entrada',
                fk_Herramienta=herramienta_existente,
                unidades=nuevas_unidades
            )

            return herramienta_existente

        # Si no existe una herramienta con ese nombre, crear una nueva
        herramienta = super().create(validated_data)

        MovimientoInventario.objects.create(
            tipo='entrada',
            fk_Herramienta=herramienta,
            unidades=nuevas_unidades
        )

        return herramienta
