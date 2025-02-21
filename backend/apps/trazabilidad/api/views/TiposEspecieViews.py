from rest_framework.viewsets import ModelViewSet
from ..models.TiposEspecieModel import TiposEspecie
from ..serializers.TiposEspecieSerializer import TiposEspecieSerializer

class TiposEspecieViewSet(ModelViewSet):
    queryset = TiposEspecie.objects.all()
    serializer_class = TiposEspecieSerializer