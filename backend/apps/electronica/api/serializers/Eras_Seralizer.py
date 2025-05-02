from rest_framework import serializers
from apps.electronica.api.serializers.Lote_Serializer import *
from apps.electronica.api.models.era import *
from apps.finanzas.api.models.cultivos import *
from apps.trazabilidad.api.models.SemillerosModel import *
from apps.trazabilidad.api.models.EspeciesModel import *
from apps.trazabilidad.api.models.PlantacionesModel import *

class EspecieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especies
        fields = ['nombre','id']

class SemilleroSerializer(serializers.ModelSerializer):
    fk_especie = EspecieSerializer()
    
    class Meta:
        model = Semilleros
        fields = ['fk_especie']

class CultivoSerializer(serializers.ModelSerializer):
    fk_Semillero = SemilleroSerializer()
    
    class Meta:
        model = Cultivos
        fields = ['fk_Semillero', 'unidades']  # Añade más campos si es necesario

class PlantacionSerializer(serializers.ModelSerializer):
    fk_Cultivo = CultivoSerializer()
    
    class Meta:
        model = Plantaciones
        fields = ['fk_Cultivo']

class ErasSerializer(serializers.ModelSerializer):
    fk_lote = LoteSerializer(read_only=True)
    fk_lote_id = serializers.PrimaryKeyRelatedField(
        queryset=Lote.objects.all(), 
        source='fk_lote', 
        write_only=True
    )
    plantaciones = PlantacionSerializer(
        many=True,
        source='plantaciones_set',  # Asegúrate que coincida con el related_name
        read_only=True
    )
    
    class Meta:
        model = Eras
        fields = '__all__'
        depth = 4  # Opcional para desarrollo, quitar en producción

