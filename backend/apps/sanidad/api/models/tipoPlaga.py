from django.db import models

class tipoPlaga(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField()
    img = models.ImageField(upload_to='tipoPlaga/', null=True, blank=True)

    def __str__(self):
        return self.nombre