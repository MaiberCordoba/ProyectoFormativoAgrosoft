import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from apps.electronica.api.models.lote import Lote

class LoteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket y une al cliente a un grupo."""
        self.group_name = 'lotes_global'

        if not self.channel_layer:
            await self.close()
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"✅ Cliente conectado al grupo {self.group_name}.")

    async def disconnect(self, close_code):
        """Maneja la desconexión del WebSocket."""
        if self.channel_layer:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"❌ Cliente desconectado del grupo {self.group_name}.")

    async def receive(self, text_data):
        """Procesa los mensajes entrantes desde WebSocket."""
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'create_lote':
                nuevo_lote = await self.create_lote(data)
                if nuevo_lote:
                    lote_info = self.serialize_lote(nuevo_lote)
                    await self.channel_layer.group_send(
                        self.group_name,
                        {"type": "broadcast_new_lote", "lote_info": lote_info}
                    )
                else:
                    await self.send(text_data=json.dumps({'error': '❌ No se pudo crear el lote'}))

            elif action == 'update_lote':
                lote_actualizado = await self.update_lote(data)
                if lote_actualizado:
                    lote_info = self.serialize_lote(lote_actualizado)
                    await self.channel_layer.group_send(
                        self.group_name,
                        {"type": "broadcast_updated_lote", "lote_info": lote_info}
                    )
                else:
                    await self.send(text_data=json.dumps({'error': '❌ No se pudo actualizar el lote'}))

            elif action == 'get_lote':
                lote_id = data.get('lote_id')
                lote = await self.get_lote(lote_id)
                if lote:
                    await self.send(text_data=json.dumps({'lote_info': self.serialize_lote(lote)}))
                else:
                    await self.send(text_data=json.dumps({'error': '❌ Lote no encontrado'}))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': "❌ Formato JSON inválido"}))

    async def broadcast_new_lote(self, event):
        """Envía el nuevo lote a todos los clientes conectados."""
        await self.send(text_data=json.dumps({
            "message": "Nuevo lote registrado",
            "lote_info": event["lote_info"]
        }))
    
    async def broadcast_updated_lote(self, event):
        """Envía la actualización de un lote a todos los clientes conectados."""
        await self.send(text_data=json.dumps({
            "message": "Lote actualizado",
            "lote_info": event["lote_info"]
        }))

    @database_sync_to_async
    def create_lote(self, data):
        """Registra un nuevo lote en la base de datos."""
        try:
            return Lote.objects.create(
                nombre=data['nombre'],
                descripcion=data.get('descripcion', ''),
                tamX=data['tamX'],
                tamY=data['tamY'],
                estado=data.get('estado', 'Activo'),
                posX=data['posX'],
                posY=data['posY'],
            )
        except Exception as e:
            print(f"Error creando lote: {e}")
            return None

    @database_sync_to_async
    def update_lote(self, data):
        """Actualiza un lote en la base de datos."""
        try:
            lote = Lote.objects.get(id=data['lote_id'])
            lote.nombre = data.get('nombre', lote.nombre)
            lote.descripcion = data.get('descripcion', lote.descripcion)
            lote.tamX = data.get('tamX', lote.tamX)
            lote.tamY = data.get('tamY', lote.tamY)
            lote.estado = data.get('estado', lote.estado)
            lote.posX = data.get('posX', lote.posX)
            lote.posY = data.get('posY', lote.posY)
            lote.save()
            return lote
        except Lote.DoesNotExist:
            return None
        except Exception as e:
            print(f"Error actualizando lote: {e}")
            return None

    @database_sync_to_async
    def get_lote(self, lote_id):
        """Busca un lote en la base de datos."""
        try:
            return Lote.objects.get(id=lote_id)
        except Lote.DoesNotExist:
            return None

    def serialize_lote(self, lote):
        """Convierte un objeto Lote en un diccionario JSON."""
        return {
            "id": lote.id,
            "nombre": lote.nombre,
            "descripcion": lote.descripcion,
            "tamX": lote.tamX,
            "tamY": lote.tamY,
            "estado": lote.estado,
            "posX": float(lote.posX),
            "posY": float(lote.posY),
        }