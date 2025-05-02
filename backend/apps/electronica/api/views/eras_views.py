from rest_framework.viewsets import ModelViewSet
from apps.electronica.api.models.era import *
from apps.electronica.api.serializers.Eras_Seralizer import *
from rest_framework.permissions import IsAuthenticated
from django.db.models import Prefetch

class Erasview(ModelViewSet):
    queryset = Eras.objects.prefetch_related(
        Prefetch('plantaciones_set', 
                queryset=Plantaciones.objects.select_related(
                    'fk_Cultivo__fk_Semillero__fk_especie'
                ))
    ).select_related('fk_lote').all()
    
    serializer_class = ErasSerializer
    #permission_classes = [IsAuthenticated]