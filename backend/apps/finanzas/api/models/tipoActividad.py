from django.db import models

class TipoActividad(models.Model):
    nombre = models.CharField(70)

    def __str__(self):
        return self.nombre