from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
#from apps.finanzas.api.models.unidadesMedida import UnidadesMedida
class Cosechas(models.Model):
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete = models.SET_NULL, null= True)
    #fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete = models.SET_NULL, null= True)
    cantidad = models.IntegerField()
    fecha = models.DateField(auto_now=False)
    precioReferencial = models.IntegerField()
    def __str__(self):
        return self.fecha