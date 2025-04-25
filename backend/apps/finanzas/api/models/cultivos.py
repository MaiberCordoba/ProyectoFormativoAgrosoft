from django.db import models
from apps.trazabilidad.api.models.SemillerosModel import Semilleros
class Cultivos(models.Model):
    fk_Semillero = models.ForeignKey(Semilleros,on_delete=models.SET_NULL, null=True)
    unidades = models.IntegerField()
    activo = models.BooleanField(default=False, null=False)
    fechaSiembra = models.DateField(auto_now=False)
    def __str__(self):
        return f"Nombre {self.fk_Semillero}"