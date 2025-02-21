from django.db import models

class TiposEspecie(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=400)
    img = models.CharField(255)
    def __str__(self):
        return self.nombre