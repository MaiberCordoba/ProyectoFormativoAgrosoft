from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.horasMensuales import HorasMensuales
from apps.finanzas.api.serializers.serializerHorasMensuales import SerializerHorasMensuales

class ViewHorasMensuales(ModelViewSet):
    queryset = HorasMensuales.objects.all()
    serializer_class = SerializerHorasMensuales