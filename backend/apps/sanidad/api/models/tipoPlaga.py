from django.db import models

class tipoPlaga(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField()
    img = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre