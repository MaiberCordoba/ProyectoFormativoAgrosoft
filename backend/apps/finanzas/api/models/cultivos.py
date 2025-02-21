from django.db import models
from apps.trazabilidad.api.models.EspeciesModel import Especies
class Cultivos(models.Model):
    fk_Especie = models.ForeignKey(Especies,on_delete=models.SET_NULL, null=True)
    nombre = models.CharField(max_length=30)
    unidades = models.IntegerField()
    activo = models.BooleanField(default=False, null=False)
    fechaSiembra = models.DateField(auto_now=False)
    def __str__(self):
        return self.nombre