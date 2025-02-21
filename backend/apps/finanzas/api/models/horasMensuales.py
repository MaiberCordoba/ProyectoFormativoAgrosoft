from django.db import models
from apps.finanzas.api.models.pasantes import Pasantes

class HorasMensuales(models.Model):
    fk_pasante = models.ForeignKey(Pasantes, on_delete=models.SET_NULL, null= True)
    minutos = models.IntegerField()
    salario = models.IntegerField()
    mes = models.CharField(max_length=15)
    def __str__(self):
        return self.minutos