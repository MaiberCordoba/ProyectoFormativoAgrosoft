from django.db import models
from django.core.exceptions import ValidationError
from apps.finanzas.api.models.actividades import Actividades
from apps.finanzas.api.models.insumos import Insumos
from apps.sanidad.api.models.controlesModel import Controles
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class UsosInsumos(models.Model):
    fk_Insumo = models.ForeignKey(Insumos, on_delete=models.SET_NULL, null=True)
    fk_Actividad = models.ForeignKey(Actividades, on_delete=models.SET_NULL, null=True)
    fk_Control = models.ForeignKey(Controles, on_delete=models.SET_NULL, null=True)
    cantidadProducto = models.IntegerField()
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL,null=True)
    costoUsoInsumo = models.FloatField(null=True)
    valorTotal = models.FloatField(null=True)
    
    def clean(self):
        if self.fk_Actividad and self.fk_Control:
            raise ValidationError("Solo se puede relacionar con una actividad o un control, no ambos.")
        if not self.fk_Actividad and not self.fk_Control:
            raise ValidationError("Debe relacionarse con una actividad o un control.")
        
    def save(self, *args, **kwargs):
        if self.fk_Insumo and self.fk_UnidadMedida:
        # Conversión a unidad base
            cantidad_en_base = self.cantidadProducto * self.fk_UnidadMedida.equivalenciabase
            self.costoUsoInsumo = (cantidad_en_base*self.fk_Insumo.valorTotalInsumos)/self.fk_Insumo.cantidadTotal

             # Resta del stock
            if self._state.adding: 
                self.fk_Insumo.cantidadDisponible -= cantidad_en_base
                self.fk_Insumo.save()

        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"insumo: {self.fk_Insumo}-Cantidad: {self.cantidadProducto}"
