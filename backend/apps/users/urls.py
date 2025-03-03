from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet

router_usuarios = DefaultRouter()

router_usuarios.register(prefix='usuarios',viewset=UsuarioViewSet,basename='usuarios')