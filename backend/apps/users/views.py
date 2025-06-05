from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Usuario
from .serializers import UsuarioSerializer
import pandas as pd
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView


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

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated], url_path='reporte')
    def reporte_usuarios(self, request):
        """Devuelve un resumen del total de usuarios, activos e inactivos"""
        total = Usuario.objects.count()
        activos = Usuario.objects.filter(estado='activo').count()
        inactivos = Usuario.objects.filter(estado='inactivo').count()

        return Response({
            'total_usuarios': total,
            'usuarios_activos': activos,
            'usuarios_inactivos': inactivos
        })


class RegistroMasivoUsuariosView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        archivo = request.FILES.get('archivo')
        if not archivo:
            return Response({'error': 'No se proporcionó ningún archivo.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            df = pd.read_excel(archivo)
        except Exception as e:
            return Response({'error': f'Error al leer el archivo: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        if df.empty:
            return Response({'error': 'El archivo no contiene datos.'}, status=status.HTTP_400_BAD_REQUEST)

        errores = []
        for index, row in df.iterrows():
            fila = index + 2  # Para tener en cuenta el encabezado

            campos_requeridos = ['nombre', 'apellido', 'email', 'username', 'password']
            faltantes = [campo for campo in campos_requeridos if not row.get(campo)]

            if faltantes:
                errores.append({
                    'fila': fila,
                    'errores': f"Campos vacíos: {', '.join(faltantes)}"
                })
                continue

            data = {
                'nombre': row.get('nombre'),
                'apellido': row.get('apellido'),
                'email': row.get('email'),
                'username': row.get('username'),
                'password': row.get('password'),           
            }

            serializer = UsuarioSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                errores.append({'fila': fila, 'errores': serializer.errors})

        if errores:
            return Response({
                'mensaje': 'Algunos usuarios no se pudieron registrar.',
                'errores': errores
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({'mensaje': 'Todos los usuarios se registraron exitosamente.'}, status=status.HTTP_201_CREATED)
