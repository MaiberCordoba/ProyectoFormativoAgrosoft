from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.usosProductos import UsosProductos
from apps.finanzas.api.serializers.serializerUsosProductos import SerializerUsosProductos

class ViewUsosProductos(ModelViewSet):
    queryset = UsosProductos.objects.all()
    serializer_class = SerializerUsosProductos