from rest_framework.serializers import ModelSerializer;
from apps.sanidad.api.models.controlesModel import Controles;
from apps.sanidad.api.serializers.afeccionesSerializer import AfeccionesModelSerializer;
from apps.sanidad.api.serializers.tiposControlSerializer import TiposControlModelSerializer;


class ControlesModelSerializer(ModelSerializer):
    afeccion = AfeccionesModelSerializer(source='fk_Afeccion',read_only=True)
    tipoControl = TiposControlModelSerializer(source='fk_TipoControl',read_only=True)
    class Meta:
        model = Controles
        fields = ['descripcion','fechaControl','afeccion','tipoControl']