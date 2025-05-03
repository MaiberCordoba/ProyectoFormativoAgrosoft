from django.db import models
from apps.trazabilidad.api.models.EspeciesModel import Especies

class Cultivos(models.Model):
    nombre = models.CharField(max_length=50,null=True,unique=True)
    activo = models.BooleanField(default=False, null=False)
    fk_Especie = models.ForeignKey(Especies,on_delete=models.SET_NULL, null=True)
    def __str__(self):
        return (str(self.fk_Especie.nombre) + str(" ") + str(self.nombre))