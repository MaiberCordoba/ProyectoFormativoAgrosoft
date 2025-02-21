from rest_framework.serializers import  ModelSerializer;
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones;
from apps.sanidad.api.serializers.plagaSerializer import PlagaModelSerializer;

class AfeccionesModelSerializer(ModelSerializer):
    plagas = PlagaModelSerializer(source='fk_Plaga',read_only=True)
    class Meta:
        model = Afecciones
        fields = ['fechaEncuentro','estado','fk_Plantacion','plagas']