from django.db import models
from apps.finanzas.api.models.actividades import Actividades
from apps.finanzas.api.models.insumos import Insumos

class UsosProductos(models.Model):
    fk_Insumo = models.ForeignKey(Insumos, on_delete=models.SET_NULL, null=True)
    fk_Actividad = models.ForeignKey(Actividades, on_delete=models.SET_NULL, null=True)
    cantidadProducto = models.IntegerField()
    def __str__(self):
        return f"insumo: {self.fk_Insumo}-Cantidad: {self.cantidadProducto}-Actividad: {self.fk_Actividad}"
