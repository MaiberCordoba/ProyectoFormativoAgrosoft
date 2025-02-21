from django.db import models
from .TiposEspecieModel import TiposEspecie

class Especies(models.Model):
    fk_TiposEspecie = models.ForeignKey(TiposEspecie,on_delete=models.SET_NULL,null=True)
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=400)
    img = models.CharField(max_length=255)
    tiempoCrecimiento = models.IntegerField()
    def __str__(self):
        return self.nombre