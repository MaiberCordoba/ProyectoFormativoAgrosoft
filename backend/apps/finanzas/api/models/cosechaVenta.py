from django.db import models
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida
from apps.finanzas.api.models.cosechas import Cosechas


class VentaCosecha(models.Model):
    venta = models.ForeignKey('Ventas', on_delete=models.CASCADE)
    cosecha = models.ForeignKey(Cosechas, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    unidad_medida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL, null=True)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, default=0)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cosecha} en Venta {self.venta.id}"