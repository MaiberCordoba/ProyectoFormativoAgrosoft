from django.db import models

class UnidadesMedida(models.Model):
    tipo_choises = [("MASA", "MASA"), ("VOLUMEN", "VOLUMEN")]

    nombre = models.CharField(max_length=50)
    abreviatura= models.CharField(max_length=50)
    tipo = models.CharField(max_length=30, choices=tipo_choises, default="MASA")
    equivalenciabase = models.IntegerField()
    def __str__(self):
        return self.nombre