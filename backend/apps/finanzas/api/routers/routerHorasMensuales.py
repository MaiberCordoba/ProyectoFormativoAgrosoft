from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewHorasMesuales import ViewHorasMensuales

routerHorasMensuales = DefaultRouter()
routerHorasMensuales.register(prefix="horas-mensuales",viewset=ViewHorasMensuales,basename="horas-mensuales")