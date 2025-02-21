from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewUsosProductos import ViewUsosProductos

routerUsosProductos = DefaultRouter()
routerUsosProductos.register(prefix="usos-productos",viewset=ViewUsosProductos,basename="usos-productos")