from django.db import models

class UnidadesTiempo(models.Model):
    nombre = models.CharField(max_length=50)
    equivalenciabase = models.IntegerField()
    def __str__(self):
        return self.nombre