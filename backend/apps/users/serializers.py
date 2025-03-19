from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    admin = serializers.BooleanField(default=False)  # 🔹 Asegura que sea un booleano

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
        
        # 🔹 Forzar que 'admin' sea un booleano (True o False)
        validated_data["admin"] = bool(validated_data.get("admin", False))

        user = Usuario.objects.create(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
