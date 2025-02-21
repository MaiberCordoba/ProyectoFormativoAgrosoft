import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.electronica.api.models.sensor import Sensor

class SensorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'sensor_updates'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            sensor_id = data.get('sensor_id')
            valor = data.get('valor')

            if not sensor_id or valor is None:
                raise ValueError("Faltan datos en el mensaje")

            sensor = Sensor.objects.get(id=sensor_id)
            sensor.valor = valor
            sensor.save()


            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'sensor_update',
                    'sensor_id': sensor.id,
                    'valor': sensor.valor,
                }
            )
        except Sensor.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': f"El sensor con ID {sensor_id} no existe."
            }))
        except ValueError as e:
            await self.send(text_data=json.dumps({'error': str(e)}))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': "Formato JSON inválido"}))

    async def sensor_update(self, event):
        await self.send(text_data=json.dumps({
            'sensor_id': event['sensor_id'],
            'valor': event['valor'],
        }))
