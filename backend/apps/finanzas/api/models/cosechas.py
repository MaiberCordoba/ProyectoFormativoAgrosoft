from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class Cosechas(models.Model):
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete=models.SET_NULL, null=True)
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL, null=True)
    cantidad = models.IntegerField()
    cantidadTotal = models.FloatField(null=True, blank=True)
    cantidadDisponible = models.FloatField(default=0)
    fecha = models.DateField(auto_now=False)
    precioReferencial = models.IntegerField(null=True)

    def __str__(self):
        return str(self.fecha)
