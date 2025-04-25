from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.finanzas.api.models.insumos import Insumos

class SerializerInsumos(ModelSerializer):
    valorTotalInsumos = serializers.FloatField(read_only=True)
    cantidadTotal = serializers.FloatField(read_only=True)
    cantidadDisponible = serializers.FloatField(read_only=True)

    class Meta:
        model = Insumos
        fields = '__all__'

    def create(self, validated_data):
        contenido = validated_data.get('contenido')
        unidades = validated_data.get('unidades')
        precio = validated_data.get('precio')
        unidad_medida = validated_data.get('fk_UnidadMedida')

        cantidad_total = contenido * unidad_medida.equivalenciabase * unidades
        valor_total = precio * unidades

        validated_data['cantidadTotal'] = cantidad_total
        validated_data['valorTotalInsumos'] = valor_total
        validated_data['cantidadDisponible'] = cantidad_total  # Inicializa igual a total

        return super().create(validated_data)

    def update(self, instance, validated_data):
        contenido = validated_data.get('contenido', instance.contenido)
        unidades = validated_data.get('unidades', instance.unidades)
        precio = validated_data.get('precio', instance.precio)
        unidad_medida = validated_data.get('fk_UnidadMedida', instance.fk_UnidadMedida)

        cantidad_total = contenido * unidad_medida.equivalenciabase * unidades
        valor_total = precio * unidades

        validated_data['cantidadTotal'] = cantidad_total
        validated_data['valorTotalInsumos'] = valor_total

        # Si no se especifica cantidadDisponible en el update, mantener la actual
        if 'cantidadDisponible' not in validated_data:
            validated_data['cantidadDisponible'] = instance.cantidadDisponible

        return super().update(instance, validated_data)