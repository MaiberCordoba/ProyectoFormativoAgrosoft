from rest_framework import serializers
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.serializers.serializerVentaCosecha import SerializerVentaCosecha
from apps.users.models import Usuario
from django.utils import timezone
from decimal import Decimal

class SerializerVentas(serializers.ModelSerializer):
    cosechas = serializers.SerializerMethodField()
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), default=serializers.CurrentUserDefault())
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Ventas
        fields = ['id', 'cosechas', 'fecha', 'numero_factura', 'valor_total', 'usuario']
        read_only_fields = ['fecha', 'numero_factura', 'valor_total']

    def get_cosechas(self, obj):
        venta_cosechas = obj.ventacosecha_set.all()
        return SerializerVentaCosecha(venta_cosechas, many=True).data

    def generate_numero_factura(self):
        today = timezone.now().date()
        prefix = f"V-{today.strftime('%Y%m%d')}-"
        last_venta = Ventas.objects.filter(numero_factura__startswith=prefix).order_by('-numero_factura').first()
        if last_venta:
            last_number = int(last_venta.numero_factura.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        return f"{prefix}{new_number:03d}"