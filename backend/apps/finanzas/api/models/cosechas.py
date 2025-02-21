from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
class Cosechas(models.Model):
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete = models.SET_NULL, null= True)
    unidades = models.IntegerField()
    fecha = models.DateField(auto_now=False)
    def __str__(self):
        return self.fecha