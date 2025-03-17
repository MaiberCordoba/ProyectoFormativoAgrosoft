from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Usuario
from .serializers import UsuarioSerializer

class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.request.method == "POST":  # Permitir acceso sin autenticación solo para POST
            return [AllowAny()]
        return [IsAdminUser()]  # Para los demás métodos, se requiere ser administrador
