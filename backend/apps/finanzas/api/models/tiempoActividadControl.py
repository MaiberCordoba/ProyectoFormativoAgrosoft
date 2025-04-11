from django.db import models
from django.core.exceptions import ValidationError
from finanzas.api.models.unidadesTiempo import UnidadesTiempo
from finanzas.api.models.actividades import Actividades
from sanidad.api.models.controlesModel import Controles
from finanzas.api.models.salarios import Salarios


class TiempoActividadControl(models.Model):
    tiempo = models.IntegerField(verbose_name="Cantidad de tiempo")  # Ej: 2
    valorTotal = models.FloatField(verbose_name="Valor total", editable=False) 
    fk_unidadTiempo = models.ForeignKey(UnidadesTiempo, on_delete=models.SET_NULL, null=True)  # Ej: hora (equivale a 60 min)
    fk_actividad = models.ForeignKey(Actividades, on_delete=models.SET_NULL,null=True)
    fk_control = models.ForeignKey(Controles, on_delete=models.SET_NULL,null=True)
    fk_salario = models.ForeignKey(Salarios, on_delete=models.SET_NULL,null=True)  # Contiene el campo monto_minutos

    def clean(self):
        if self.fk_actividad and self.fk_control:
            raise ValidationError("Solo puede relacionarse con una actividad O un control, no ambos.")
        if not self.fk_actividad and not self.fk_control:
            raise ValidationError("Debe seleccionar una actividad O un control.")

    def save(self, *args, **kwargs):
        # 1. Convertir a minutos
        minutos_equivalentes = self.tiempo * self.fk_unidadTiempo.equivalenciaMinutos

        # 2. Calcular valor total
        self.valorTotal = minutos_equivalentes * self.fk_salario.monto_minutos

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Tiempo: {self.tiempo} {self.fk_unidadTiempo.nombre} - Valor: ${self.valorTotal:.2f}"

    class Meta:
        verbose_name = "Registro de Tiempo"
        verbose_name_plural = "Registros de Tiempo"
