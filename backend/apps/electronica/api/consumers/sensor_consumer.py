import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.electronica.api.models.sensor import Sensor

class SensorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket para un sensor específico."""
        self.sensor_id = self.scope['url_route']['kwargs'].get('sensor_id')
        self.room_group_name = f"sensor_{self.sensor_id}" if self.sensor_id else "sensors_global"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print(f"✅ Cliente conectado al grupo {self.room_group_name}")

    async def disconnect(self, close_code):
        """Maneja la desconexión del WebSocket."""
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print(f"❌ Cliente desconectado del grupo {self.room_group_name}")

    async def receive(self, text_data):
        """Procesa los mensajes recibidos del WebSocket."""
        try:
            data = json.loads(text_data)
            action = data.get('action')
            print(f"📥 Mensaje recibido: {data}")

            if action == "update_sensor":
                await self.update_sensor(data)
            elif action == "get_sensor":
                await self.get_sensor_by_id(data)
            else:
                await self.send(json.dumps({'error': "❌ Acción no válida"}))
        except json.JSONDecodeError:
            await self.send(json.dumps({'error': "❌ Formato JSON inválido"}))
        except Exception as e:
            print(f"❌ Error en receive: {e}")
            await self.send(json.dumps({'error': f"❌ Error interno: {str(e)}"}))

    async def update_sensor(self, data):
        """Actualiza un sensor y envía notificaciones si es necesario."""
        sensor_id = data.get('sensor_id')
        valor = data.get('valor')

        if not sensor_id or valor is None:
            await self.send(json.dumps({'error': "❌ Datos insuficientes"}))
            return

        sensor = await self.get_sensor(sensor_id)
        if not sensor:
            await self.send(json.dumps({'error': f"❌ Sensor {sensor_id} no encontrado"}))
            return

        await self.save_sensor(sensor_id, valor)
        timestamp = datetime.utcnow().isoformat()

        # Notificación de alerta si la temperatura es extrema
        alerta = None
        if valor >= 35:
            alerta = "⚠️ Alerta: Temperatura muy alta, posible sobrecalentamiento."
        elif valor <= 22:
            alerta = "❄️ Alerta: Temperatura muy baja, posible riesgo de congelamiento."

        # Mensaje principal con datos actualizados (siempre incluye "alerta")
        mensaje_sensor = {
            'sensor_id': sensor.id,
            'valor': float(valor),
            'tipo': sensor.tipo,
            'timestamp': timestamp,
            'alerta': alerta if alerta else None  # Se asegura de que siempre esté presente
        }

        # Enviar actualización del sensor
        await self.channel_layer.group_send(
            f"sensor_{sensor_id}",
            {
                'type': 'sensor_update',
                'mensaje_sensor': mensaje_sensor
            }
        )

        # Enviar notificación si hay alerta
        if alerta:
            await self.channel_layer.group_send(
                "sensors_global",
                {
                    'type': 'sensor_alert',
                    'alerta': alerta
                }
            )

    async def get_sensor_by_id(self, data):
        """Obtiene un sensor por su ID y lo envía al cliente."""
        sensor_id = data.get('sensor_id')

        if not sensor_id:
            await self.send(json.dumps({'error': "❌ Se requiere un ID de sensor"}))
            return

        sensor = await self.get_sensor(sensor_id)
        if not sensor:
            await self.send(json.dumps({'error': f"❌ Sensor {sensor_id} no encontrado"}))
            return

        sensor_info = {
            "id": sensor.id,
            "tipo": sensor.tipo,
            "valor": float(sensor.valor),
            "fecha": sensor.fecha.isoformat()
        }

        await self.send(json.dumps({"sensor_info": sensor_info}))

    async def sensor_update(self, event):
        """Envía actualizaciones de sensor a los clientes conectados."""
        await self.send(json.dumps(event['mensaje_sensor']))

    async def sensor_alert(self, event):
        """Envía alertas a todos los clientes conectados."""
        await self.send(json.dumps({"alerta": event["alerta"]}))

    @sync_to_async
    def get_sensor(self, sensor_id):
        """Obtiene un sensor de la base de datos."""
        try:
            return Sensor.objects.get(id=sensor_id)
        except Sensor.DoesNotExist:
            return None

    @sync_to_async
    def save_sensor(self, sensor_id, valor):
        """Actualiza el valor del sensor en la base de datos."""
        Sensor.objects.filter(id=sensor_id).update(valor=valor)