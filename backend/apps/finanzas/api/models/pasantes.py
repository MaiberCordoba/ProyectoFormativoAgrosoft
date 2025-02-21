from django.db import models
from apps.users.models import Usuario

class Pasantes(models.Model):
    fk_Usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL,null=True)
    fechaInicioPasantia = models.DateField(auto_now=False)
    fechaFinalizacion = models.DateField(auto_now=False)
    salarioHora = models.IntegerField()
    area = models.CharField(max_length = 50)
    def __str__(self):
        return self.fk_Usuario