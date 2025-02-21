from rest_framework.viewsets import ModelViewSet
from ..models.PlantacionesModel import Plantaciones
from ..serializers.PlantacionesSerializer import PlantacionesSerializer

class PlantacionesViewSet(ModelViewSet):
    queryset = Plantaciones.objects.all()
    serializer_class = PlantacionesSerializer