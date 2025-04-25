from django.db import models
from apps.finanzas.api.models.cosechas import Cosechas
from apps.trazabilidad.api.models.HerramientasModel import Herramientas
from apps.users.models import Usuario
from apps.finanzas.api.models.insumos import Insumos

class MovimientoInventario(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida')
    ]
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    cantidad = models.IntegerField()
    descripcion = models.TextField(max_length=300)
    fk_Insumo = models.ForeignKey(Insumos, models.SET_NULL, null=True, blank=True)
    fk_Herramienta = models.ForeignKey(Herramientas, models.SET_NULL, null=True, blank=True)
    fk_Cosecha = models.ForeignKey(Cosechas, models.SET_NULL, null=True, blank=True)
    fk_Usuario = models.ForeignKey(Usuario, models.SET_NULL, null=True, blank=True)

    
    def __str__(self):
        return self.descripcion
