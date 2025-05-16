import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.core.exceptions import ValidationError
from django.db import models
from apps.electronica.api.models.era import Eras
from apps.electronica.api.models.lote import Lote
from apps.electronica.api.models.sensor import Sensor


class SensorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sensor_id = self.scope["url_route"]["kwargs"].get("sensor_id")
        self.room_group_name = f"sensor_{self.sensor_id}" if self.sensor_id else "sensors_global"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        if not self.sensor_id:
            recent_alerts = await self.get_recent_alerts()
            if recent_alerts:
                await self.send(json.dumps({
                    "type": "initial_alerts",
                    "alerts": recent_alerts
                }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get("action")

            if action == "update_sensor":
                await self.handle_sensor_update(data)
            elif action == "get_sensor":
                await self.handle_get_sensor(data)
            elif action == "set_thresholds":
                await self.handle_set_thresholds(data)
            else:
                await self.send_error("Acción no válida")
        except json.JSONDecodeError:
            await self.send_error("Formato JSON inválido")
        except ValidationError as e:
            await self.send_error(f"Error de validación: {str(e)}")
        except Exception as e:
            await self.send_error(f"Error interno: {str(e)}")

    async def handle_sensor_update(self, data):
        sensor_id = data.get("sensor_id") or self.sensor_id
        valor = data.get("valor")

        if not sensor_id or valor is None:
            return await self.send_error("Se requieren sensor_id y valor")

        try:
            valor = float(valor)
            sensor = await self.update_sensor_value(sensor_id, valor)
            if not sensor:
                return await self.send_error(f"Sensor {sensor_id} no encontrado")

            update_message = await self.prepare_sensor_message(sensor)
            is_alert = await self.check_thresholds(sensor)

            # Envía mensaje al grupo del sensor
            await self.channel_layer.group_send(
                f"sensor_{sensor_id}",
                {
                    "type": "sensor.update",
                    "message": {**update_message, "alert": is_alert}
                }
            )

            # También a todos los sensores (vista general)
            await self.channel_layer.group_send(
                "sensors_global",
                {
                    "type": "sensor.global_update",
                    "message": update_message,
                    "is_alert": is_alert
                }
            )

            # Si es alerta, notifica a la vista global
            if is_alert:
                alert_message = self._prepare_alert_dict(sensor)
                await self.channel_layer.group_send(
                    "sensors_global",
                    {
                        "type": "sensor.alert",
                        "message": alert_message
                    }
                )

        except ValueError:
            await self.send_error("Valor no válido")

    async def handle_get_sensor(self, data):
        sensor_id = data.get("sensor_id") or self.sensor_id
        if not sensor_id:
            return await self.send_error("Se requiere sensor_id")

        sensor = await self.get_sensor(sensor_id)
        if not sensor:
            return await self.send_error(f"Sensor {sensor_id} no encontrado")

        await self.send(json.dumps(await self.prepare_sensor_message(sensor)))

    async def handle_set_thresholds(self, data):
        sensor_id = data.get("sensor_id") or self.sensor_id
        min_threshold = data.get("min")
        max_threshold = data.get("max")

        if not sensor_id:
            return await self.send_error("Se requiere sensor_id")

        try:
            sensor = await self.set_sensor_thresholds(sensor_id, min_threshold, max_threshold)
            if not sensor:
                return await self.send_error(f"Sensor {sensor_id} no encontrado")

            response = {
                "type": "thresholds.updated",
                "sensor_id": sensor.id,
                "thresholds": {
                    "min": float(sensor.umbral_minimo) if sensor.umbral_minimo else None,
                    "max": float(sensor.umbral_maximo) if sensor.umbral_maximo else None
                }
            }
            await self.send(json.dumps(response))
        except ValueError as e:
            await self.send_error(str(e))

    @sync_to_async
    def update_sensor_value(self, sensor_id, valor):
        try:
            sensor = Sensor.objects.get(id=sensor_id)
            sensor.valor = valor
            sensor.fecha = datetime.now()
            sensor.save()
            return sensor
        except Sensor.DoesNotExist:
            return None

    @sync_to_async
    def get_sensor(self, sensor_id):
        try:
            return Sensor.objects.get(id=sensor_id)
        except Sensor.DoesNotExist:
            return None

    @sync_to_async
    def set_sensor_thresholds(self, sensor_id, min_val, max_val):
        try:
            sensor = Sensor.objects.get(id=sensor_id)
            if min_val is not None:
                sensor.umbral_minimo = float(min_val)
            if max_val is not None:
                sensor.umbral_maximo = float(max_val)
            sensor.save()
            return sensor
        except Sensor.DoesNotExist:
            return None

    @sync_to_async
    def check_thresholds(self, sensor):
        return (
            (sensor.umbral_maximo is not None and sensor.valor > sensor.umbral_maximo) or
            (sensor.umbral_minimo is not None and sensor.valor < sensor.umbral_minimo)
        )

    @sync_to_async
    def get_recent_alerts(self, limit=5):
        alert_conditions = models.Q(valor__gt=models.F('umbral_maximo')) | models.Q(valor__lt=models.F('umbral_minimo'))
        alerts = Sensor.objects.filter(
            alert_conditions,
            umbral_minimo__isnull=False,
            umbral_maximo__isnull=False
        ).order_by('-fecha')[:limit]
        return [self._prepare_alert_dict(alert) for alert in alerts]

    def _prepare_alert_dict(self, sensor):
        return {
            "sensor_id": sensor.id,
            "sensor_type": sensor.tipo,
            "value": float(sensor.valor),
            "min_threshold": float(sensor.umbral_minimo),
            "max_threshold": float(sensor.umbral_maximo),
            "message": self.get_alert_message(sensor),
            "timestamp": sensor.fecha.isoformat(),
            "location": {
                "lote_id": sensor.fk_lote_id,
                "era_id": sensor.fk_eras_id
            }
        }

    def get_alert_message(self, sensor):
        value = float(sensor.valor)
        min_v = float(sensor.umbral_minimo) if sensor.umbral_minimo is not None else None
        max_v = float(sensor.umbral_maximo) if sensor.umbral_maximo is not None else None
        tipo_sensor = dict(sensor.SENSOR_TYPES).get(sensor.tipo, "Desconocido")

        if min_v is not None and value < min_v:
            return f"{tipo_sensor}: Valor {value} por debajo del mínimo permitido ({min_v})"
        elif max_v is not None and value > max_v:
            return f"{tipo_sensor}: Valor {value} por encima del máximo permitido ({max_v})"
        return "Valor dentro del umbral"

    async def prepare_sensor_message(self, sensor):
        return {
            "type": "sensor.info",
            "sensor_id": sensor.id,
            "sensor_type": sensor.tipo,
            "value": float(sensor.valor),
            "thresholds": {
                "min": float(sensor.umbral_minimo) if sensor.umbral_minimo else None,
                "max": float(sensor.umbral_maximo) if sensor.umbral_maximo else None
            },
            "timestamp": sensor.fecha.isoformat(),
            "location": {
                "lote_id": sensor.fk_lote_id,
                "era_id": sensor.fk_eras_id
            }
        }

    async def send_error(self, message):
        await self.send(json.dumps({"type": "error", "message": message}))

    # Eventos internos que escucha el grupo
    async def sensor_update(self, event):
        await self.send(json.dumps({"type": "sensor.update", **event["message"]}))

    async def sensor_global_update(self, event):
        await self.send(json.dumps({"type": "sensor.global_update", **event}))

    async def sensor_alert(self, event):
        await self.send(json.dumps({"type": "sensor.alert", **event}))
