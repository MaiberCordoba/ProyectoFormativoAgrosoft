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
    precioReferencial = models.IntegerField()

    def save(self, *args, **kwargs):
        if self.fk_UnidadMedida:
            self.cantidadTotal = self.cantidad * self.fk_UnidadMedida.equivalenciabase

            if self.cantidadDisponible == 0 or self._state.adding:
                self.cantidadDisponible = self.cantidadTotal

        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.fecha)
