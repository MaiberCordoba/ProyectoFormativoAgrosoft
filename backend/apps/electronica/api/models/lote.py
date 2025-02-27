from decimal import Decimal
import math
from django.db import models


class Lote(models.Model):
    nombre = models.CharField(max_length=15, unique=True)
    descripcion = models.TextField()
    tamX = models.PositiveSmallIntegerField()
    tamY = models.PositiveSmallIntegerField()
    estado = models.BooleanField(default=True)
    posX = models.DecimalField(max_digits=6, decimal_places=2)
    posY = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.nombre
    
    def calcular_evapotranspiracion(self):
        """Calcula la evapotranspiración basándose en los datos de sensores."""
        from apps.electronica.api.models.sensor import Sensor
        try:
            temperatura = Decimal(self.sensores.filter(tipo='TEM').latest('fecha').valor)
            humedad_relativa = Decimal(self.sensores.filter(tipo='HUM_A').latest('fecha').valor)
            radiacion_solar = Decimal(self.sensores.filter(tipo='LUM').latest('fecha').valor)
            velocidad_viento = Decimal(self.sensores.filter(tipo='VIE').latest('fecha').valor)

            velocidad_viento = velocidad_viento * Decimal(1000) / Decimal(3600)  
            radiacion_solar = radiacion_solar * Decimal(0.0864)

            elevacion = Decimal(1000)

            es = Decimal(0.6108) * (Decimal(2.718281828459045) ** ((Decimal(17.27) * temperatura) / (temperatura + Decimal(237.3))))
            ea = es * (humedad_relativa / Decimal(100))

            delta = (Decimal(4098) * es) / ((temperatura + Decimal(237.3)) ** 2)

            gamma = Decimal(0.665 * 10 ** -3) * (Decimal(101.3) * ((Decimal(293) - (Decimal(0.0065) * elevacion)) / Decimal(293)) ** Decimal(5.26))

            ET0 = (Decimal(0.408) * delta * radiacion_solar +
                   gamma * (Decimal(900) / (temperatura + Decimal(273))) * velocidad_viento * (es - ea)) / \
                  (delta + gamma * (Decimal(1) + Decimal(0.34) * velocidad_viento))

            return round(ET0, 2)
        except Sensor.DoesNotExist:
            return "No hay datos suficientes para calcular la evapotranspiración."

