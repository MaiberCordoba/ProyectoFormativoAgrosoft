from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
from apps.users.models import Usuario

class Actividades(models.Model):
    ESTADO_CHOICES = [
        ('AS',"Asignada"),
        ('CO',"Completada"),
        ('CA',"Cancelada")
    ]
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete = models.SET_NULL, null= True)
    fk_Usuario=models.ForeignKey(Usuario, on_delete= models.SET_NULL,null=True)
    titulo = models.CharField(max_length=50)
    descripcion = models.TextField(max_length=200)
    fecha =models.DateField(auto_now=False)
    estado=models.CharField(max_length=3,choices=ESTADO_CHOICES)
    def __str__(self):
        return self.titulo