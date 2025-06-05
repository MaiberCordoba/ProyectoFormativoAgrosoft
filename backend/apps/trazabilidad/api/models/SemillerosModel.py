from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos

class Semilleros(models.Model):
    unidades = models.IntegerField()
    fechasiembra = models.DateField()
    fechaestimada = models.DateField()
    fk_Cultivo = models.ForeignKey(Cultivos,on_delete=models.SET_NULL,null=True)

    def save(self, *args, **kwargs):
        if self.fk_Cultivo:
            self.fk_Cultivo = self.fk_Cultivo.capitalize()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return ('Semillero del cultivo:'+str(self.fk_Cultivo))
