from rest_framework.serializers import ModelSerializer, ValidationError
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario
from apps.finanzas.api.models.insumos import Insumos

class SerializerUsosInsumos(ModelSerializer):
    class Meta:
        model = UsosInsumos
        fields = '__all__'
        read_only_fields = ["costoUsoInsumo"]

    def validate(self, data):
        fk_actividad = data.get('fk_Actividad')
        fk_control = data.get('fk_Control')

        if fk_actividad and fk_control:
            raise ValidationError("Solo se puede relacionar con una actividad o un control, no ambos.")
        if not fk_actividad and not fk_control:
            raise ValidationError("Debe relacionarse con una actividad o un control.")
        
        return data

    def create(self, validated_data):
        insumo = validated_data['fk_Insumo']
        unidad_medida = validated_data['fk_UnidadMedida']
        cantidad_producto = validated_data['cantidadProducto']
        equivalencia_base = unidad_medida.equivalenciabase if unidad_medida else 1
        cantidad_gramos = cantidad_producto * equivalencia_base

        if insumo.cantidadGramos is None or insumo.cantidadGramos < cantidad_gramos:
            raise ValidationError("No hay suficiente cantidad disponible del insumo en gramos.")

        precio_uso_insumo = (insumo.valorTotalInsumos * cantidad_gramos) / insumo.totalGramos
        validated_data['costoUsoInsumo'] = precio_uso_insumo

        insumo.cantidadGramos -= cantidad_gramos
        insumo.save()

        uso = super().create(validated_data)

        MovimientoInventario.objects.create(
            tipo='salida',
            fk_Insumo=insumo,
            fk_UsoInsumo=uso,
            unidades=cantidad_producto
        )

        return uso

    def update(self, instance, validated_data):
        insumo = instance.fk_Insumo
        unidad_medida_anterior = instance.fk_UnidadMedida
        cantidad_producto_anterior = instance.cantidadProducto
        equivalencia_base_anterior = unidad_medida_anterior.equivalenciabase if unidad_medida_anterior else 1
        cantidad_gramos_anterior = cantidad_producto_anterior * equivalencia_base_anterior

        # Revertir uso anterior
        if insumo.cantidadGramos is None:
            insumo.cantidadGramos = 0
        insumo.cantidadGramos += cantidad_gramos_anterior

        # Calcular nuevo uso
        unidad_medida_nueva = validated_data.get('fk_UnidadMedida', unidad_medida_anterior)
        cantidad_producto_nuevo = validated_data.get('cantidadProducto', cantidad_producto_anterior)
        equivalencia_base_nueva = unidad_medida_nueva.equivalenciabase if unidad_medida_nueva else 1
        cantidad_gramos_nueva = cantidad_producto_nuevo * equivalencia_base_nueva

        if insumo.cantidadGramos < cantidad_gramos_nueva:
            raise ValidationError("No hay suficiente cantidad disponible del insumo para esta actualización.")

        # Calcular nuevo costo
        precio_uso_insumo = (insumo.valorTotalInsumos * cantidad_gramos_nueva) / insumo.cantidadGramos
        validated_data['costoUsoInsumo'] = precio_uso_insumo

        # Aplicar nuevo descuento
        insumo.cantidadGramos -= cantidad_gramos_nueva
        insumo.save()

        return super().update(instance, validated_data)
