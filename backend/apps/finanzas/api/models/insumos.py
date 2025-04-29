from django.db import models
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class Insumos(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=150)
    precio = models.IntegerField()
    compuestoActivo = models.CharField(max_length=20, null=True)
    contenido = models.FloatField(null=True)
    fichaTecnica = models.CharField(max_length=20, null=True)
    unidades = models.IntegerField()
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida , on_delete=models.SET_NULL, null=True)

    valorTotalInsumos = models.FloatField(null=True, blank=True)
    cantidadTotal = models.FloatField(null=True, blank=True)
    cantidadDisponible = models.FloatField(default=0)

    def __str__(self):
        return self.nombre
