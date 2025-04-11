from django.db import models

class Salarios(models.Model):
    ESTADOS = [
        ('activo','activo'),
        ('inactivo','inactivo')
    ]
    nombre = models.CharField(max_length=40)
    monto = models.IntegerField()
    horas = models.FloatField()
    monto_minutos = models.FloatField(null=True, blank=True)
    estado = models.CharField(max_length=10,choices=ESTADOS)
    
    def save(self, *args, **kwargs):
        self.monto_minutos = self.monto / (self.horas * 60)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre} - ${self.monto}/día"