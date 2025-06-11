from rest_framework import serializers
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario
from apps.finanzas.api.models.insumos import Insumos
from apps.trazabilidad.api.models.HerramientasModel import Herramientas
from django.utils import timezone

class SerializerMovimientoInventario(serializers.ModelSerializer):
    fecha = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', default_timezone=timezone.get_default_timezone())

    class Meta:
        model = MovimientoInventario
        fields = '__all__'

    def validate(self, data):
        tipo = data.get('tipo')
        insumo = data.get('fk_Insumo')
        herramienta = data.get('fk_Herramienta')
        uso_insumo = data.get('fk_UsoInsumo')
        uso_herramienta = data.get('fk_UsoHerramienta')
        fecha = data.get('fecha')

        if insumo and herramienta:
            raise serializers.ValidationError("Solo se puede registrar un insumo o una herramienta, no ambos.")

        if not (uso_insumo or uso_herramienta):
            if not tipo:
                raise serializers.ValidationError("El tipo es obligatorio para movimientos manuales.")
            if 'unidades' not in data:
                raise serializers.ValidationError("Las unidades son obligatorias para movimientos manuales.")
            if not fecha:
                data['fecha'] = timezone.now()

        if fecha and fecha > timezone.now():
            raise serializers.ValidationError("La fecha no puede ser futura.")

        return data

    def create(self, validated_data):
        tipo = validated_data.get('tipo')
        unidades = validated_data.get('unidades')
        insumo = validated_data.get('fk_Insumo')
        herramienta = validated_data.get('fk_Herramienta')

        if not validated_data.get('fk_UsoInsumo') and not validated_data.get('fk_UsoHerramienta'):
            if insumo:
                insumo_obj = Insumos.objects.get(pk=insumo.id)
                if tipo == 'entrada':
                    insumo_obj.unidades += unidades
                elif tipo == 'salida':
                    if unidades > insumo_obj.unidades:
                        raise serializers.ValidationError("No hay suficientes unidades en stock.")
                    insumo_obj.unidades -= unidades
                insumo_obj.save()

            elif herramienta:
                herramienta_obj = Herramientas.objects.get(pk=herramienta.id)
                if tipo == 'entrada':
                    herramienta_obj.unidades += unidades
                elif tipo == 'salida':
                    if unidades > herramienta_obj.unidades:
                        raise serializers.ValidationError("No hay suficientes unidades en stock.")
                    herramienta_obj.unidades -= unidades

                # Recalcular valorTotal = unidades * precio
                herramienta_obj.valorTotal = herramienta_obj.unidades * herramienta_obj.precio
                herramienta_obj.save()

        return super().create(validated_data)

    def update(self, instance, validated_data):
        tipo_anterior = instance.tipo
        unidades_anteriores = instance.unidades
        insumo_anterior = instance.fk_Insumo
        herramienta_anterior = instance.fk_Herramienta

        # Revertir el movimiento anterior
        if insumo_anterior:
            insumo = Insumos.objects.get(pk=insumo_anterior.id)
            if tipo_anterior == 'entrada':
                insumo.unidades -= unidades_anteriores
            elif tipo_anterior == 'salida':
                insumo.unidades += unidades_anteriores
            insumo.save()

        elif herramienta_anterior:
            herramienta = Herramientas.objects.get(pk=herramienta_anterior.id)
            if tipo_anterior == 'entrada':
                herramienta.unidades -= unidades_anteriores
            elif tipo_anterior == 'salida':
                herramienta.unidades += unidades_anteriores
            herramienta.valorTotal = herramienta.unidades * herramienta.precio
            herramienta.save()

        # Aplicar el nuevo movimiento
        tipo_nuevo = validated_data.get('tipo', instance.tipo)
        unidades_nuevas = validated_data.get('unidades', instance.unidades)
        insumo_nuevo = validated_data.get('fk_Insumo', instance.fk_Insumo)
        herramienta_nueva = validated_data.get('fk_Herramienta', instance.fk_Herramienta)

        if insumo_nuevo:
            insumo = Insumos.objects.get(pk=insumo_nuevo.id)
            if tipo_nuevo == 'entrada':
                insumo.unidades += unidades_nuevas
            elif tipo_nuevo == 'salida':
                if unidades_nuevas > insumo.unidades:
                    raise serializers.ValidationError("No hay suficientes unidades en stock.")
                insumo.unidades -= unidades_nuevas
            insumo.save()

        elif herramienta_nueva:
            herramienta = Herramientas.objects.get(pk=herramienta_nueva.id)
            if tipo_nuevo == 'entrada':
                herramienta.unidades += unidades_nuevas
            elif tipo_nuevo == 'salida':
                if unidades_nuevas > herramienta.unidades:
                    raise serializers.ValidationError("No hay suficientes unidades en stock.")
                herramienta.unidades -= unidades_nuevas
            herramienta.valorTotal = herramienta.unidades * herramienta.precio
            herramienta.save()

        return super().update(instance, validated_data)
