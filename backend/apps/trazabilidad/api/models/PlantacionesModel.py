from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
from apps.electronica.api.models.era import Eras

class Plantaciones(models.Model):
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete=models.SET_NULL,null=True)
    fk_Era = models.ForeignKey(Eras, on_delete=models.SET_NULL,null=True)
    creado = models.DateTimeField(auto_now=True)
    def __str__(self):
        return (str(self.fk_Cultivo) + str(self.fk_Era) + str(self.creado))