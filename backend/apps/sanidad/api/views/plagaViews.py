from rest_framework.viewsets import ModelViewSet
from apps.sanidad.api.models.PlagaModel import Plaga
from apps.sanidad.api.serializers.plagaSerializer import PlagaModelSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class PlagaModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PlagaModelSerializer
    queryset = Plaga.objects.all()