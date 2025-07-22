import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class UserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket."""
        try:
            self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
            self.user_group = f"user_{self.user_id}"
            logger.debug(f"Intento de conexión WebSocket para user_id={self.user_id}")

            # Agrega el usuario al grupo
            await self.channel_layer.group_add(self.user_group, self.channel_name)
            await self.accept()
            logger.debug(f"Conexión WebSocket aceptada para user_id={self.user_id}")

            # Envía un mensaje inicial como en NotificationConsumer
            await self.send(text_data=json.dumps({
                "type": "connection_established",
                "message": f"Conectado a usuario {self.user_id}"
            }))
        except Exception as e:
            logger.error(f"Error en connect: {str(e)}")
            await self.close(code=1011, reason=f"Error interno: {str(e)}")

    async def disconnect(self, close_code):
        """Maneja la desconexión WebSocket."""
        logger.debug(f"Desconexión WebSocket para user_id={self.user_id}, código={close_code}, reason={self.scope.get('close_reason', 'No reason provided')}")
        if hasattr(self, "user_group"):
            await self.channel_layer.group_discard(self.user_group, self.channel_name)

    async def send_user_update(self, event):
        """Envía actualizaciones al usuario por WebSocket."""
        logger.debug(f"Enviando actualización para user_id={self.user_id}: {event}")
        await self.send(text_data=json.dumps({
            "type": "user_data",
            "id": event["id"],
            "email": event["email"],
            "estado": event["estado"],
            "rol": event["rol"],
        }))