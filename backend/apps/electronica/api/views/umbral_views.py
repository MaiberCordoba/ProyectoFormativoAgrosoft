from rest_framework.viewsets import ModelViewSet
from apps.electronica.api.models.umbral import Umbral
from apps.electronica.api.serializers.umbral_serializer import UmbralSerializer

class UmbralViewSet(ModelViewSet):
    queryset = Umbral.objects.all()
    serializer_class = UmbralSerializer


