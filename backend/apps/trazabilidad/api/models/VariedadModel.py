from django.db import models

class Variedad(models.Model):
    nombre = models.CharField(max_length=30)
    def __str__(self):
        return self.nombre
