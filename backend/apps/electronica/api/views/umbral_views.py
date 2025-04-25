from rest_framework.viewsets import ModelViewSet
from apps.electronica.api.models.umbral import *
from apps.electronica.api.serializers.umbral_serializer import *
from rest_framework.permissions import IsAuthenticated

class Erasview(ModelViewSet):
    queryset = Umbral.objects.all()
    serializer_class = UmbralSerializer
    #permission_classes = [IsAuthenticated]
