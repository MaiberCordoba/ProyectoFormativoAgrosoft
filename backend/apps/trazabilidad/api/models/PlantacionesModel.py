from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
from apps.electronica.api.models.era import Eras
from apps.trazabilidad.api.models.SemillerosModel import Semilleros

class Plantaciones(models.Model):
    unidades = models.IntegerField()
    fechaSiembra = models.DateField(auto_now=False)
    fk_semillero = models.ForeignKey(Semilleros,on_delete=models.SET_NULL, null=True)
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete=models.SET_NULL,null=True)
    fk_Era = models.ForeignKey(Eras, on_delete=models.SET_NULL,null=True)
    creado = models.DateTimeField(auto_now=True)
    def __str__(self):
        return (str(self.fk_semillero) + str(self.fk_Cultivo) + str(" ") + str(self.fk_Era))