# apps/notifications/services.py
from apps.notificaciones.models import Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings

class NotificationService:
    @staticmethod
    def create_notification(user, title, message, notification_type, 
                          related_object=None, metadata=None, send_email=True):
        """
        Crea una notificación y la envía por WebSocket y/o email
        """
        # Crear notificación en la base de datos
        notification = Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            metadata=metadata or {}
        )
        
        if related_object:
            notification.related_object_id = related_object.id
            notification.related_content_type = related_object.__class__.__name__
            notification.save()
        
        # Preparar datos para WebSocket
        notification_data = {
            "id": notification.id,
            "title": title,
            "message": message,
            "type": notification_type,
            "is_read": False,
            "created_at": notification.created_at.isoformat(),
            "metadata": metadata or {},
            "send_email": send_email
        }
        
        # Enviar por WebSocket
        channel_layer = get_channel_layer()
        if channel_layer:
            user_group = f"user_{user.id}_notifications"
            async_to_sync(channel_layer.group_send)(
                user_group,
                {
                    "type": "send_notification",
                    "notification": notification_data,
                    "email": user.correoElectronico if send_email else None
                }
            )

            
        
        return notification