from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewPasantes import ViewPasantes

routerPasantes= DefaultRouter()
routerPasantes.register(prefix='pasantes',viewset=ViewPasantes,basename="pasantes")
