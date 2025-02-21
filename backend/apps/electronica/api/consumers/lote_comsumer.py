import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.electronica.api.models.lote import Lote

class LoteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        self.lote_id = self.scope['url_route']['kwargs']['lote_id']
        self.group_name = f'lote_{self.lote_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):

        data = json.loads(text_data)
        action = data.get('action')

        if action == 'update_evapotranspiracion':
            try:
                lote = Lote.objects.get(id=self.lote_id)
                evapotranspiracion = lote.calcular_evapotranspiracion()

                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        'type': 'send_evapotranspiracion',
                        'evapotranspiracion': evapotranspiracion,
                    }
                )
            except Lote.DoesNotExist:
                await self.send(text_data=json.dumps({'error': 'Lote no encontrado'}))

    async def send_evapotranspiracion(self, event):

        await self.send(text_data=json.dumps({
            'evapotranspiracion': event['evapotranspiracion']
        }))
