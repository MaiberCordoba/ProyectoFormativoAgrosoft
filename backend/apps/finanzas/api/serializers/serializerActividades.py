from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.actividades import Actividades
from apps.trazabilidad.api.serializers.PlantacionesSerializer import PlantacionesSerializer
from rest_framework import serializers

class SerializerActividades(ModelSerializer):
    plantaciones = PlantacionesSerializer(source='fk_Plantacion',read_only=True)
    class Meta:
        model = Actividades
        fields = '__all__'
        
    def validate(self, data):
        """
        Valida que solo se proporcione fk_Cultivo o fk_Plantacion, pero no ambos.
        """
        fk_cultivo = data.get('fk_Cultivo')
        fk_plantacion = data.get('fk_Plantacion')
        
        if fk_cultivo is not None and fk_plantacion is not None:
            raise serializers.ValidationError(
                "Solo se puede asignar un Cultivo o una Plantación, no ambos."
            )
        
        if fk_cultivo is None and fk_plantacion is None:
            raise serializers.ValidationError(
                "Debe asignarse un Cultivo o una Plantación."
            )
            
        return data