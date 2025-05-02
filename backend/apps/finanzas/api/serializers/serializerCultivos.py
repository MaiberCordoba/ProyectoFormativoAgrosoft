from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.cultivos import Cultivos
from apps.trazabilidad.api.serializers.SemillerosSerializer import SemillerosSerializer
class SerializerCultivos(ModelSerializer):
    semillero = SemillerosSerializer(source='fk_Semillero',read_only=True)
    class Meta:
        model = Cultivos
        fields = '__all__'
