from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.actividades import Actividades
from apps.finanzas.api.serializers.serializerActividades import SerializerActividades

class ViewActividades(ModelViewSet):
    queryset = Actividades.objects.all()
    serializer_class = SerializerActividades