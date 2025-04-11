from django.db import models
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida


class Insumos(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=150)
    precio = models.IntegerField()
    compuestoActivo = models.CharField(max_length=20)
    contenido = models.FloatField()
    fichaTecnica = models.CharField(max_length=20)
    unidades = models.IntegerField()
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida , on_delete=models.SET_NULL, null=True)
    valorTotalInsumos = models.FloatField()
    cantidadTotal = models.FloatField()
    
    def save(self, *args, **kwargs):
        
        self.cantidadTotal = self.contenido * self.fk_UnidadMedida.equivalenciabase * self.unidades
        self.valorTotalInsumos = self.precio * self.unidades

        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.nombre