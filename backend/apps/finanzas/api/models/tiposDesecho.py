from django.db import models

class TiposDesecho(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(max_length=200)
    def __str__(self):
        return self.nombre