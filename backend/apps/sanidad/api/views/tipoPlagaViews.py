from rest_framework.viewsets import ModelViewSet
from apps.sanidad.api.models.tipoPlaga import tipoPlaga
from apps.sanidad.api.serializers.tipoPlagaSerializer import TipoPlagaModelSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class TipoPlagaModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]    
    serializer_class = TipoPlagaModelSerializer
    queryset = tipoPlaga.objects.all()
    