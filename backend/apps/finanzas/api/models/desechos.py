from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.tiposDesecho import TiposDesecho

class Desechos(models.Model):
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete = models.SET_NULL, null= True)
    fk_TipoDesecho = models.ForeignKey(TiposDesecho, on_delete=models.SET_NULL, null= True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(max_length=200)
    def __str__(self):
        return self.nombre