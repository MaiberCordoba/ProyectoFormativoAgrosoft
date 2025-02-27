import asyncio
import websockets
import json
import random
import datetime

URI = "ws://127.0.0.1:8000/ws/sensor/1/"

async def send_sensor_data(websocket):
    """Envía datos simulados de sensores periódicamente al WebSocket"""
    while True:
        try:
            timestamp = datetime.datetime.utcnow().isoformat()
            sensor_data = {
                "type": "update_sensor",
                "sensor_id": 1,
                "valor": round(random.uniform(20.0, 40.0), 2),
                "timestamp": timestamp
            }

            await websocket.send(json.dumps(sensor_data))
            print(f"📤 Enviado: {sensor_data}")

            await asyncio.sleep(5) 

        except websockets.ConnectionClosed:
            print("❌ Conexión cerrada, intentando reconectar...")
            break 

async def receive_sensor_data(websocket):
    """Escucha datos del WebSocket"""
    while True:
        try:
            data = await websocket.recv()
            data = json.loads(data)

            if "error" in data:
                print('❌ Error del servidor:', data["error"])
            elif "sensor_id" in data and "valor" in data:
                print(f'📡 Recibido: Sensor {data["sensor_id"]} -> {data["valor"]} ({data.get("timestamp", "Sin timestamp")})')

        except websockets.ConnectionClosed:
            print("❌ Conexión cerrada por el servidor.")
            break

async def connect():
    """Maneja la conexión al WebSocket con reintentos"""
    while True:
        try:
            async with websockets.connect(URI) as websocket:
                print('✅ Conexión establecida al WebSocket.')

                await asyncio.gather(
                    send_sensor_data(websocket),
                    receive_sensor_data(websocket)
                )

        except Exception as e:
            print(f'❌ Error de conexión: {e}, reintentando en 5 segundos...')
            await asyncio.sleep(5) 


asyncio.run(connect())
