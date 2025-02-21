from django.db import models
from apps.finanzas.api.models.cosechas import Cosechas

class Ventas(models.Model):
    fk_Cosecha = models.ForeignKey(Cosechas, on_delete=models.SET_NULL, null=True)
    precioUnitario = models.IntegerField()
    fecha = models.DateField(auto_now=False)
    def __str__(self):
        return self.fecha