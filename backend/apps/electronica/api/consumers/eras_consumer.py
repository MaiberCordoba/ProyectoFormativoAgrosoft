import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.electronica.api.models.era import Eras

class ErasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.era_id = self.scope['url_route']['kwargs']['era_id']
        self.group_name = f'era_{self.era_id}'

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

        if action == 'update_era':
            try:
                era = Eras.objects.get(id=self.era_id)

                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        'type': 'send_era_data',
                        'era_data': {
                            'tipo': era.tipo,
                            'tamX': str(era.tamX),
                            'tamY': str(era.tamY),
                            'posX': str(era.posX),
                            'posY': str(era.posY),
                            'lote': era.fk_lote.nombre if era.fk_lote else 'Sin lote',
                        },
                    }
                )
            except Eras.DoesNotExist:
                await self.send(text_data=json.dumps({'error': 'Era no encontrada'}))

    async def send_era_data(self, event):
        await self.send(text_data=json.dumps({
            'era_data': event['era_data']
        }))
