from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.actividades import Actividades
from apps.finanzas.api.serializers.serializerActividades import SerializerActividades
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class ViewActividades(ModelViewSet):
    queryset = Actividades.objects.all()
    serializer_class = SerializerActividades

    def perform_create(self, serializer):
        """Sobrescribimos la creación para enviar una notificación."""
        actividad = serializer.save()  # Guarda la actividad en la base de datos
        
        if actividad.fk_Usuario is not None:  # Verificamos que el usuario exista
            try:
                # Obtener el canal de WebSockets
                channel_layer = get_channel_layer()
                if channel_layer is None:
                    print("Error: No se pudo obtener el canal de WebSockets")
                    return
                
                user_group = f"notificaciones_{actividad.fk_Usuario.id}"

                # Mensaje de la notificación
                notification_data = {
                    "message": f"Tienes una nueva actividad: {actividad.titulo}"
                }

                # Enviar notificación en tiempo real
                async_to_sync(channel_layer.group_send)(
                    user_group,
                    {
                        "type": "send_notification",
                        "message": notification_data
                    }
                )
            except Exception as e:
                print(f"Error enviando la notificación: {e}")
