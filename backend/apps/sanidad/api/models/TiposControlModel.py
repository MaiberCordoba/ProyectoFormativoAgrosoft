from django.db import models

class TiposControl(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre