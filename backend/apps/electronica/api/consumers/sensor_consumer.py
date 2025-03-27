import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.electronica.api.models.sensor import Sensor

class SensorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sensor_name = self.scope["url_route"]["kwargs"].get("sensor_name")
        self.room_group_name = f"sensor_{self.sensor_name}" if self.sensor_name else "sensors_global"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print(f"✅ Cliente conectado al grupo {self.room_group_name} (Sensor: {self.sensor_name})")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print(f"❌ Cliente desconectado del grupo {self.room_group_name}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get("action")

            if action == "update_sensor":
                await self.update_sensor(data)
            elif action == "get_sensor":
                await self.send_sensor_info(data)
            else:
                await self.send(json.dumps({"error": "❌ Acción no válida"}))
        except json.JSONDecodeError:
            await self.send(json.dumps({"error": "❌ Formato JSON inválido"}))
        except Exception as e:
            print(f"❌ Error en receive(): {repr(e)}")
            await self.send(json.dumps({"error": f"❌ Error interno: {str(e)}"}))

    async def update_sensor(self, data):
        sensor_name = data.get("sensor_name")
        valor = data.get("valor")

        if not sensor_name or valor is None:
            await self.send(json.dumps({"error": "❌ Datos insuficientes"}))
            return

        try:
            valor = float(valor)
        except ValueError:
            await self.send(json.dumps({"error": "❌ Valor no válido"}))
            return

        sensor = await self.get_sensor_by_name(sensor_name)
        if not sensor:
            await self.send(json.dumps({"error": f"❌ Sensor {sensor_name} no encontrado"}))
            return

        await self.save_sensor(sensor.id, valor)
        timestamp = datetime.utcnow().isoformat()

        alerta = None
        if sensor.tipo == "TEM":
            if valor >= 35:
                alerta = "⚠️ Alerta: Temperatura muy alta, posible sobrecalentamiento."
            elif valor <= 22:
                alerta = "❄️ Alerta: Temperatura muy baja, posible riesgo de congelamiento."

        mensaje_sensor = {
            "sensor_id": sensor.id,
            "sensor_name": sensor.nombre,
            "valor": valor,
            "tipo": sensor.tipo,
            "timestamp": timestamp,
            "alerta": alerta,
        }

        await self.channel_layer.group_send(
            f"sensor_{sensor_name}",
            {"type": "sensor_update", "mensaje_sensor": mensaje_sensor},
        )

        if alerta:
            await self.channel_layer.group_send(
                "sensors_global", {"type": "sensor_alert", "alerta": alerta}
            )

    async def send_sensor_info(self, data):
        sensor_name = data.get("sensor_name")
        if not sensor_name:
            await self.send(json.dumps({"error": "❌ Se requiere un nombre de sensor"}))
            return

        sensor = await self.get_sensor_by_name(sensor_name)
        if not sensor:
            await self.send(json.dumps({"error": f"❌ Sensor {sensor_name} no encontrado"}))
            return

        sensor_info = {
            "id": sensor.id,
            "nombre": sensor.nombre,
            "tipo": sensor.tipo,
            "valor": float(sensor.valor),
            "fecha": sensor.fecha.isoformat(),
        }

        await self.send(json.dumps({"sensor_info": sensor_info}))

    async def sensor_update(self, event):
        await self.send(json.dumps(event["mensaje_sensor"]))

    async def sensor_alert(self, event):
        await self.send(json.dumps({"alerta": event["alerta"]}))

    @sync_to_async
    def get_sensor_by_name(self, sensor_name):
        try:
            return Sensor.objects.get(nombre=sensor_name)
        except Sensor.DoesNotExist:
            return None

    @sync_to_async
    def save_sensor(self, sensor_id, valor):
        try:
            sensor = Sensor.objects.get(id=sensor_id)
            sensor.valor = valor
            sensor.save()
            return sensor
        except Sensor.DoesNotExist:
            return None
