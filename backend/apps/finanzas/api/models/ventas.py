from django.db import models
from apps.finanzas.api.models.cosechas import Cosechas
from apps.users.models import Usuario 

class Ventas(models.Model):
    cosechas = models.ManyToManyField(Cosechas, through='VentaCosecha')
    fecha = models.DateTimeField(auto_now=True)
    numero_factura = models.CharField(max_length=20, unique=True, blank=True)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return f'Venta {self.numero_factura} - {self.fecha}'