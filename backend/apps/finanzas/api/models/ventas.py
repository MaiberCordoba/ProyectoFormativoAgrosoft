from django.db import models
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class Ventas(models.Model):
    fk_Cosecha = models.ForeignKey(Cosechas, on_delete=models.SET_NULL, null=True)
    precioUnitario = models.IntegerField()
    fecha = models.DateField(auto_now=False)
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL, null=True)
    cantidad = models.IntegerField()
    valorTotal = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs): 
        # Calcular valor total
        self.valorTotal = self.precioUnitario * self.cantidad

        # Descontar del stock si es un nuevo registro
        if self.fk_Cosecha and self.fk_UnidadMedida and self._state.adding:
            cantidad_en_base = self.cantidad * self.fk_UnidadMedida.equivalenciabase
            self.fk_Cosecha.cantidadDisponible -= cantidad_en_base
            self.fk_Cosecha.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.fecha)
