from django.contrib import admin
from apps.finanzas.api.models.tiposDesecho import TiposDesecho
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.desechos import Desechos
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.models.actividades import Actividades
from apps.finanzas.api.models.insumos import Insumos
from apps.finanzas.api.models.usosProductos import UsosProductos
# Register your models here.

admin.site.register(TiposDesecho)
admin.site.register(Cultivos)
admin.site.register(Desechos)
admin.site.register(Cosechas)
admin.site.register(Ventas)
admin.site.register(Actividades)
admin.site.register(Insumos)
admin.site.register(UsosProductos)
