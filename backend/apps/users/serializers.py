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
            "fechaNacimiento",
            "telefono",
            "correoElectronico",
            "password",
            "admin",
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
