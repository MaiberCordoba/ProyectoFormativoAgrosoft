import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.core.exceptions import ValidationError
from apps.electronica.api.models.sensor import Sensor

class SensorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket"""
        self.sensor_id = self.scope["url_route"]["kwargs"].get("sensor_id")
        self.room_group_name = f"sensor_{self.sensor_id}" if self.sensor_id else "sensors_global"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        
        # Enviar confirmación de conexión
        await self.send(json.dumps({
            "type": "connection_established",
            "message": f"Conectado al grupo: {self.room_group_name}",
            "sensor_id": self.sensor_id
        }))

    async def disconnect(self, close_code):
        """Maneja la desconexión WebSocket"""
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print(f"Desconectado del grupo {self.room_group_name}")

    async def receive(self, text_data):
        """Maneja los mensajes recibidos"""
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
            print(f"Error en receive(): {repr(e)}")
            await self.send_error(f"Error interno: {str(e)}")

    async def handle_sensor_update(self, data):
        """Actualiza el valor de un sensor"""
        sensor_id = data.get("sensor_id") or self.sensor_id
        valor = data.get("valor")

        if not sensor_id or valor is None:
            return await self.send_error("Se requieren sensor_id y valor")

        try:
            valor = float(valor)
            sensor = await self.update_sensor_value(sensor_id, valor)
            
            if not sensor:
                return await self.send_error(f"Sensor {sensor_id} no encontrado")

            # Preparar mensaje de actualización
            update_message = await self.prepare_sensor_message(sensor)
            
            # Enviar actualización al grupo específico del sensor
            await self.channel_layer.group_send(
                f"sensor_{sensor_id}",
                {"type": "sensor.update", "message": update_message}
            )

            # Verificar umbrales y enviar alertas si es necesario
            if await self.check_thresholds(sensor):
                alert_message = {
                    "type": "sensor.alert",
                    "sensor_id": sensor.id,
                    "sensor_type": sensor.tipo,
                    "value": float(sensor.valor),
                    "message": self.get_alert_message(sensor),
                    "timestamp": datetime.utcnow().isoformat()
                }
                # Enviar alerta al grupo global
                await self.channel_layer.group_send(
                    "sensors_global",
                    alert_message
                )

        except ValueError:
            await self.send_error("Valor no válido")

    async def handle_get_sensor(self, data):
        """Obtiene información de un sensor"""
        sensor_id = data.get("sensor_id") or self.sensor_id
        if not sensor_id:
            return await self.send_error("Se requiere sensor_id")

        sensor = await self.get_sensor(sensor_id)
        if not sensor:
            return await self.send_error(f"Sensor {sensor_id} no encontrado")

        sensor_info = {
            "type": "sensor.info",
            "sensor_id": sensor.id,
            "sensor_type": sensor.tipo,
            "value": float(sensor.valor),
            "thresholds": {
                "min": float(sensor.umbral_minimo) if sensor.umbral_minimo else None,
                "max": float(sensor.umbral_maximo) if sensor.umbral_maximo else None
            },
            "timestamp": sensor.fecha.isoformat()
        }

        await self.send(json.dumps(sensor_info))

    async def handle_set_thresholds(self, data):
        """Establece umbrales para un sensor"""
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

    async def prepare_sensor_message(self, sensor):
        """Prepara el mensaje de actualización del sensor"""
        return {
            "sensor_id": sensor.id,
            "sensor_type": sensor.tipo,
            "value": float(sensor.valor),
            "thresholds": {
                "min": float(sensor.umbral_minimo) if sensor.umbral_minimo else None,
                "max": float(sensor.umbral_maximo) if sensor.umbral_maximo else None
            },
            "timestamp": sensor.fecha.isoformat(),
            "alert": await self.check_thresholds(sensor)
        }

    def get_alert_message(self, sensor):
        """Genera mensajes de alerta según el tipo de sensor"""
        value = float(sensor.valor)
        
        if sensor.umbral_maximo and value > float(sensor.umbral_maximo):
            return f"⚠️ Alerta: Valor {value} supera el umbral máximo ({sensor.umbral_maximo})"
        
        if sensor.umbral_minimo and value < float(sensor.umbral_minimo):
            return f"⚠️ Alerta: Valor {value} está por debajo del umbral mínimo ({sensor.umbral_minimo})"
        
        return None

    async def check_thresholds(self, sensor):
        """Verifica si el valor del sensor está fuera de los umbrales"""
        if not sensor.umbral_minimo and not sensor.umbral_maximo:
            return False
            
        value = float(sensor.valor)
        return ((sensor.umbral_maximo and value > float(sensor.umbral_maximo)) or
                (sensor.umbral_minimo and value < float(sensor.umbral_minimo)))

    async def send_error(self, message):
        """Envía un mensaje de error estandarizado"""
        error_msg = {
            "type": "error",
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.send(json.dumps(error_msg))

    # Métodos para manejar tipos específicos de mensajes
    async def sensor_update(self, event):
        await self.send(json.dumps(event["message"]))

    async def sensor_alert(self, event):
        await self.send(json.dumps(event))

    # Métodos de base de datos (sync_to_async)
    @sync_to_async
    def get_sensor(self, sensor_id):
        try:
            return Sensor.objects.get(id=sensor_id)
        except Sensor.DoesNotExist:
            return None

    @sync_to_async
    def update_sensor_value(self, sensor_id, value):
        try:
            sensor = Sensor.objects.get(id=sensor_id)
            sensor.valor = value
            sensor.save()
            return sensor
        except Sensor.DoesNotExist:
            return None
        except Exception as e:
            print(f"Error al actualizar sensor: {str(e)}")
            return None

    @sync_to_async
    def set_sensor_thresholds(self, sensor_id, min_threshold, max_threshold):
        try:
            sensor = Sensor.objects.get(id=sensor_id)
            
            if min_threshold is not None:
                sensor.umbral_minimo = float(min_threshold)
            if max_threshold is not None:
                sensor.umbral_maximo = float(max_threshold)
            
            # Validar que el mínimo sea menor que el máximo
            if (sensor.umbral_minimo is not None and 
                sensor.umbral_maximo is not None and 
                sensor.umbral_minimo >= sensor.umbral_maximo):
                raise ValueError("El umbral mínimo debe ser menor que el máximo")
            
            sensor.save()
            return sensor
        except Sensor.DoesNotExist:
            return None
        except ValueError as e:
            raise e
        except Exception as e:
            print(f"Error al establecer umbrales: {str(e)}")
            return None