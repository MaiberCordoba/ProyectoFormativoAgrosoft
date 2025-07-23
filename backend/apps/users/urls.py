from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, RegistroMasivoUsuariosView, UserCountView
from django.urls import path

router_usuarios = DefaultRouter()
router_usuarios.register(prefix='usuarios', viewset=UsuarioViewSet, basename='usuarios')

urlpatterns = [
    # Endpoint para carga masiva de usuarios desde archivo Excel
    path('usuarios/carga-masiva/', RegistroMasivoUsuariosView.as_view(), name='carga-masiva-usuarios'),
    path('usuarios/count/', UserCountView.as_view(), name='user-count'),
]

# Agrega automáticamente todas las rutas del ViewSet, incluido /usuarios/reporte/
urlpatterns += router_usuarios.urls
