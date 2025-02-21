from rest_framework.viewsets import ModelViewSet;
from apps.sanidad.api.serializers.controlesSerializer import ControlesModelSerializer;
from apps.sanidad.api.models.controlesModel import Controles;
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ControleslModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ControlesModelSerializer
    queryset = Controles.objects.all()
    