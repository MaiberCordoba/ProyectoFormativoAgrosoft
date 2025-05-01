from django.db import models
from apps.electronica.api.models.lote import Lote

class Eras(models.Model):
    fk_lote = models.ForeignKey(Lote, on_delete=models.SET_NULL, null=True) 
    tipo = models.CharField(max_length=20)
    tamX = models.DecimalField(max_digits=10, decimal_places=4)
    tamY = models.DecimalField(max_digits=10, decimal_places=4)
    posX = models.FloatField()
    posY = models.FloatField()

    def __str__(self):
        return f"Era {self.tipo} en {self.fk_lote.nombre if self.fk_lote else 'sin lote'}"