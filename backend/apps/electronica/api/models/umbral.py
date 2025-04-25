from django.db import models
from apps.electronica.api.models.sensor import Sensor


class Umbral (models.Model):
    sensor =  models.ForeignKey(Sensor, on_delete=models.SET_NULL, null=True) 
    valor_minimo = models.DecimalField(max_digits=10, decimal_places=2)
    valor_maximo = models.DecimalField(max_digits=10, decimal_places=2)


    def __str__(self):
        return f'{self.sensor_id} - Valor mínimo: {self.valor_minimo}, Valor máximo: {self.valor_maximo}'

