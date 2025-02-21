from django.db import models

class Insumos(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=150)
    precio = models.IntegerField()
    unidades = models.IntegerField()
    def __str__(self):
        return self.nombre