from django.db import models

class Lote(models.Model):
    nombre = models.CharField(max_length=15)
    descripcion = models.TextField()
    tamX = models.PositiveSmallIntegerField()
    tamY = models.PositiveSmallIntegerField()
    estado = models.BooleanField(default=True)
    posX = models.DecimalField(max_digits=6, decimal_places=2)
    posY = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.nombre