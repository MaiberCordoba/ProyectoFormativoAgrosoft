from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, RegistroMasivoUsuariosView
from django.urls import path


router_usuarios = DefaultRouter()

router_usuarios.register(prefix='usuarios',viewset=UsuarioViewSet,basename='usuarios')

urlpatterns = [
    path('usuarios/carga-masiva/', RegistroMasivoUsuariosView.as_view(), name='carga-masiva-usuarios'),
]

urlpatterns += router_usuarios.urls