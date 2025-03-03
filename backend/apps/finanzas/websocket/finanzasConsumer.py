import json
from channels.generic.websocket import AsyncWebsocketConsumer

class FinanzasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket."""
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_group = f"notificaciones_{self.user_id}"

        # Agrega el usuario al grupo de notificaciones
        await self.channel_layer.group_add(self.user_group, self.channel_name)
        await self.accept()

        # Mensaje indicando quién se ha conectado
        await self.send(text_data=json.dumps({
            "message": f"El usuario {self.user_id} se ha conectado a notificaciones"
        }))

    async def disconnect(self, close_code):
        """Maneja la desconexión WebSocket."""
        await self.channel_layer.group_discard(self.user_group, self.channel_name)

    async def send_notification(self, event):
        """Recibe la notificación desde la vista y la envía al usuario."""
        message = event["message"]
        await self.send(text_data=json.dumps({"notification": message}))
