from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.insumos import Insumos
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario

class SerializerInsumos(ModelSerializer):
    class Meta:
        model = Insumos
        fields = '__all__'
        read_only_fields = ["valorTotalInsumos", "cantidadGramos", "totalGramos"]

    def create(self, validated_data):
        nombre = validated_data.get("nombre")
        unidad_medida = validated_data.get("fk_UnidadMedida")
        precio = validated_data.get("precio", 0)
        unidades = validated_data.get("unidades", 0)
        contenido = validated_data.get("contenido", 0)

        equivalencia_base = unidad_medida.equivalenciabase if unidad_medida else 1
        cantidad_gramos = unidades * contenido * equivalencia_base
        valor_total = precio * unidades

        # Buscar insumo existente solo por nombre
        insumo_existente = Insumos.objects.filter(nombre=nombre).first()

        if insumo_existente:
            # Sumar nuevos valores al existente
            insumo_existente.unidades += unidades
            insumo_existente.cantidadGramos += cantidad_gramos
            insumo_existente.totalGramos += cantidad_gramos
            insumo_existente.valorTotalInsumos += valor_total
            insumo_existente.save()

            # Registrar movimiento de entrada
            MovimientoInventario.objects.create(
                tipo='entrada',
                fk_Insumo=insumo_existente,
                unidades=unidades
            )

            return insumo_existente

        # Si no existe insumo con el mismo nombre, crear uno nuevo
        validated_data["cantidadGramos"] = cantidad_gramos
        validated_data["valorTotalInsumos"] = valor_total
        validated_data["totalGramos"] = cantidad_gramos

        insumo_nuevo = super().create(validated_data)

        MovimientoInventario.objects.create(
            tipo='entrada',
            fk_Insumo=insumo_nuevo,
            unidades=unidades
        )

        return insumo_nuevo
