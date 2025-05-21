# apps/notifications/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.mail import send_mail
from django.conf import settings

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket."""
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_group = f"user_{self.user_id}_notifications"

        # Agrega el usuario al grupo de notificaciones
        await self.channel_layer.group_add(self.user_group, self.channel_name)
        await self.accept()

        await self.send(text_data=json.dumps({
            "type": "connection_established",
            "message": f"Conectado a notificaciones para usuario {self.user_id}"
        }))

    async def disconnect(self, close_code):
        """Maneja la desconexión WebSocket."""
        await self.channel_layer.group_discard(self.user_group, self.channel_name)

    async def send_notification(self, event):
        """Envía notificación al usuario."""
        notification = event["notification"]
        email = event.get("email")
        
        # Envía la notificación por WebSocket
        await self.send(text_data=json.dumps({
            "type": "notification",
            "notification": notification
        }))
        
        # Si hay email, envía también por correo
        if email and notification.get("send_email", True):
            try:
                send_mail(
                    subject=notification.get("title", "Nueva notificación"),
                    message=notification.get("message", ""),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error enviando email: {e}")