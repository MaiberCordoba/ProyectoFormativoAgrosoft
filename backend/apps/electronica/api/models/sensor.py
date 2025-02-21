from django.db import models
from apps.electronica.api.models.lote import Lote
from apps.electronica.api.models.era import Eras

class Sensor(models.Model):
    SENSOR_TYPES = [
        ('TEM', 'Temperatura'),
        ('LUM', 'Iluminación'),
        ('HUM_A', 'Humedad Ambiental'),
        ('VIE', 'Velocidad del Viento'),
        ('HUM_T', 'Humedad del Terreno'),
        ('PH', 'Nivel de PH')
    ]

    fk_lote = models.ForeignKey(Lote, on_delete=models.SET_NULL, null=True, related_name='sensores', blank=True)
    fk_eras = models.ForeignKey(Eras, on_delete=models.SET_NULL, null=True, related_name='sensores', blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(max_length=6, choices=SENSOR_TYPES)
    valor = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        tipo_sensor = dict(self.SENSOR_TYPES).get(self.tipo, 'Desconocido')
        if self.fk_eras:
            ubicacion = self.fk_eras.fk_lote.nombre
        elif self.fk_lote:
            ubicacion = self.fk_lote.nombre
        else:
            ubicacion = 'Sin ubicación'
        return f"{tipo_sensor}: {self.valor} en {ubicacion}"