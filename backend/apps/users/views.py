from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Usuario
from .serializers import UsuarioSerializer

class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.request.method == "POST":  
            return [AllowAny()]  # Permite a cualquier usuario registrarse
        return [IsAuthenticated()]  

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Devuelve la información del usuario autenticado"""
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
