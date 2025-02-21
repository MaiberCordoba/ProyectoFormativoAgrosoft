from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.pasantes import Pasantes
from apps.finanzas.api.serializers.serializerPasantes import ViewPasantes

class ViewPasantes(ModelViewSet):
    queryset =Pasantes.objects.all()
    serializer_class = ViewPasantes