from django.db import models
from apps.finanzas.api.models.actividades import Actividades
from apps.finanzas.api.models.insumos import Insumos
from apps.sanidad.api.models.controlesModel import Controles
#from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class UsosInsumos(models.Model):
    fk_Insumo = models.ForeignKey(Insumos, on_delete=models.SET_NULL, null=True)
    fk_Actividad = models.ForeignKey(Actividades, on_delete=models.SET_NULL, null=True)
    fk_Control = models.ForeignKey(Controles, on_delete=models.SET_NULL, null=True)
    cantidadProducto = models.IntegerField()
    #fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL,null=True)
    def __str__(self):
        return f"insumo: {self.fk_Insumo}-Cantidad: {self.cantidadProducto}"
