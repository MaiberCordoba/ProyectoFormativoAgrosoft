import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from apps.electronica.api.models.era import Eras
from apps.electronica.api.models.lote import Lote

class ErasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket para una era específica."""
        self.era_id = self.scope['url_route']['kwargs'].get('era_id')
        self.group_name = f'era_{self.era_id}' if self.era_id else 'eras_global'
        self.channel_layer = get_channel_layer()

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"✅ Cliente conectado al grupo {self.group_name}")

    async def disconnect(self, close_code):
        """Maneja la desconexión del WebSocket."""
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"❌ Cliente desconectado del grupo {self.group_name}")

    async def receive(self, text_data):
        """Procesa los mensajes recibidos desde el WebSocket."""
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == "register_era":
                await self.register_era(data)
            elif action == "get_era":
                await self.get_era_by_id(data)
            elif action == "update_era":
                await self.update_era(data)
            else:
                await self.send(json.dumps({'error': "❌ Acción no válida"}))
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            await self.send(json.dumps({'error': f"❌ Error en la estructura del mensaje: {str(e)}"}))
        except Exception as e:
            print(f"❌ Error en receive: {e}")
            await self.send(json.dumps({'error': f"❌ Error interno: {str(e)}"}))

    async def register_era(self, data):
        """Registra una nueva era en la base de datos."""
        try:
            fk_lote_id = data.get('fk_lote')
            tipo = data.get('tipo')
            tamX = data.get('tamX')
            tamY = data.get('tamY')
            posX = data.get('posX')
            posY = data.get('posY')

            # Validar si el lote existe
            lote = None
            if fk_lote_id:
                try:
                    lote = await sync_to_async(Lote.objects.get, thread_sensitive=True)(id=fk_lote_id)
                except Lote.DoesNotExist:
                    await self.send(json.dumps({'error': f"❌ Lote {fk_lote_id} no existe"}))
                    return

            # Crear la era en la base de datos
            new_era = await sync_to_async(Eras.objects.create, thread_sensitive=True)(
                fk_lote=lote, tipo=tipo, tamX=tamX, tamY=tamY, posX=posX, posY=posY
            )

            era_info = {
                "id": new_era.id,
                "fk_lote": new_era.fk_lote.id if new_era.fk_lote else None,
                "tipo": new_era.tipo,
                "tamX": new_era.tamX,
                "tamY": new_era.tamY,
                "posX": new_era.posX,
                "posY": new_era.posY
            }

            # Notificar a todos los clientes en tiempo real
            await self.channel_layer.group_send("eras_global", {
                "type": "broadcast_new_era", "era_info": era_info
            })

        except Exception as e:
            print(f"❌ Error al registrar era: {e}")
            await self.send(json.dumps({'error': f"❌ Error al registrar era: {str(e)}"}))

    async def update_era(self, data):
        """Actualiza una era existente y notifica en tiempo real."""
        era_id = data.get('era_id')
        if not era_id:
            await self.send(json.dumps({'error': "❌ Se requiere un ID de era"}))
            return

        try:
            era = await sync_to_async(Eras.objects.get, thread_sensitive=True)(id=era_id)
        except Eras.DoesNotExist:
            await self.send(json.dumps({'error': f"❌ Era {era_id} no encontrada"}))
            return

        tamX = data.get('tamX', era.tamX)
        tamY = data.get('tamY', era.tamY)
        posX = data.get('posX', era.posX)
        posY = data.get('posY', era.posY)

        if any([tamX != era.tamX, tamY != era.tamY, posX != era.posX, posY != era.posY]):
            era.tamX, era.tamY, era.posX, era.posY = tamX, tamY, posX, posY
            await sync_to_async(era.save, thread_sensitive=True)()

            await self.channel_layer.group_send(f"era_{era_id}", {
                'type': 'send_era_data',
                'era_id': era.id,
                'tamX': era.tamX,
                'tamY': era.tamY,
                'posX': era.posX,
                'posY': era.posY
            })

            await self.send(json.dumps({
                'message': f"✅ Era {era_id} actualizada correctamente",
                'era_info': {
                    'era_id': era.id,
                    'tamX': era.tamX,
                    'tamY': era.tamY,
                    'posX': era.posX,
                    'posY': era.posY
                }
            }))
        else:
            await self.send(json.dumps({'message': "⚠️ No hubo cambios en la era"}))

    async def get_era_by_id(self, data):
        """Obtiene una era por su ID y la envía al cliente."""
        era_id = data.get('era_id')

        if not era_id:
            await self.send(json.dumps({'error': "❌ Se requiere un ID de era"}))
            return

        try:
            era = await sync_to_async(Eras.objects.get, thread_sensitive=True)(id=era_id)
            era_info = {
                "id": era.id,
                "fk_lote": era.fk_lote.id if era.fk_lote else None,
                "tipo": era.tipo,
                "tamX": era.tamX,
                "tamY": era.tamY,
                "posX": era.posX,
                "posY": era.posY
            }
            await self.send(json.dumps({"era_info": era_info}))
        except Eras.DoesNotExist:
            await self.send(json.dumps({'error': f"❌ Era {era_id} no encontrada"}))
        except Exception as e:
            print(f"❌ Error en get_era_by_id: {e}")
            await self.send(json.dumps({'error': f"❌ Error interno: {str(e)}"}))

    async def send_era_data(self, event):
        await self.send(json.dumps(event))

    async def broadcast_new_era(self, event):
        await self.send(json.dumps({"message": "Nueva era registrada", "era_info": event["era_info"]}))