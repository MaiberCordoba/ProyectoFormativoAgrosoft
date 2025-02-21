from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewVentas import ViewVentas

routerVentas = DefaultRouter()
routerVentas.register(prefix="Ventas",viewset=ViewVentas,basename="Ventas")