from django.db import models
from apps.electronica.api.models.sensor import Sensor
from django.core.exceptions import ValidationError

class Umbral(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, null=True, related_name="umbrales")
    valor_minimo = models.DecimalField(max_digits=10, decimal_places=2)
    valor_maximo = models.DecimalField(max_digits=10, decimal_places=2)

    def clean(self):
        if self.valor_minimo >= self.valor_maximo:
            raise ValidationError("El valor mínimo debe ser menor al valor máximo.")
    
    def __str__(self):
        return f'{self.sensor.id} - Valor mínimo: {self.valor_minimo}, Valor máximo: {self.valor_maximo}'