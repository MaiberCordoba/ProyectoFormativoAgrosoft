from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.serializers.serializerCultivos import SerializerCultivos

class ViewCultivos(ModelViewSet):
    queryset = Cultivos.objects.all()
    serializer_class = SerializerCultivos

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Si llega una nueva imagen, elimina la anterior
        if 'img' in request.FILES and instance.img:
            instance.img.delete(save=False)

        return super().update(request, *args, **kwargs)