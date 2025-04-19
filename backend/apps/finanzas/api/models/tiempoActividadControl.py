from django.db import models
from django.core.exceptions import ValidationError
from apps.finanzas.api.models.unidadesTiempo import UnidadesTiempo
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles
from apps.finanzas.api.models.salarios import Salarios

class TiempoActividadControl(models.Model):
    tiempo = models.IntegerField(verbose_name="Cantidad de tiempo")
    valorTotal = models.FloatField(verbose_name="Valor total", editable=False)
    fk_unidadTiempo = models.ForeignKey(UnidadesTiempo, on_delete=models.SET_NULL, null=True)
    fk_actividad = models.ForeignKey(Actividades, on_delete=models.SET_NULL, null=True, blank=True)
    fk_control = models.ForeignKey(Controles, on_delete=models.SET_NULL, null=True, blank=True)
    fk_salario = models.ForeignKey(Salarios, on_delete=models.SET_NULL, null=True)

    def clean(self):
        if self.fk_actividad and self.fk_control:
            raise ValidationError("Solo puede relacionarse con una actividad O un control, no ambos.")
        if not self.fk_actividad and not self.fk_control:
            raise ValidationError("Debe seleccionar una actividad O un control.")

    def __str__(self):
        return f"Tiempo: {self.tiempo} {self.fk_unidadTiempo.nombre} - Valor: ${self.valorTotal:.2f}"

    class Meta:
        verbose_name = "Registro de Tiempo"
        verbose_name_plural = "Registros de Tiempo"
