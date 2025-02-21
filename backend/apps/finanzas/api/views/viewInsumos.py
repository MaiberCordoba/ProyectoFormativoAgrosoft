from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.insumos import Insumos
from apps.finanzas.api.serializers.serializerInsumos import SerializerInsumos

class ViewInsumos(ModelViewSet):
    queryset = Insumos.objects.all()
    serializer_class = SerializerInsumos 
