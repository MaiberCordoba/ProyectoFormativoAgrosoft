from django.db import models
from apps.finanzas.api.models.cosechas import Cosechas
# from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class Ventas(models.Model):
    fk_Cosecha = models.ForeignKey(Cosechas, on_delete=models.SET_NULL, null=True)
    precioUnitario = models.IntegerField()
    fecha = models.DateField(auto_now=False)
    # fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL, null=True)
    cantidad = models.IntegerField()
    valorTotal = models.IntegerField(blank=True, null=True) #blank = no es obligatorio en Formulario #null = puede estar vacio en la bd antes de guardarse

    def save(self, *args, **kwargs): #args y kwargs permite capturar cualquier argumento que que django le pase al metodo
        # Calcula el valor total antes de guardar
        self.valorTotal = self.precioUnitario * self.cantidad
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.fecha)
