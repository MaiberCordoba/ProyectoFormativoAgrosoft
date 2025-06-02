from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "identificacion",
            "nombre",
            "apellidos",
            "telefono",
            "correoElectronico",
            "password",
            "estado",
            "rol",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        
        user = Usuario.objects.create(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Actualizar campos normales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Manejo CRUCIAL de la contraseña
        if password:
            instance.set_password(password)  # Genera el hash correcto
        
        instance.save()
        return instance