import asyncio
import websockets
import json

async def connect():
    uri = "ws://127.0.0.1:8000/ws/sensor/"
    async with websockets.connect(uri) as websocket:
        print('Conexión establecida al WebSocket.')

        await websocket.send(json.dumps({
            "sensor_id": 1,
            "valor": 42.5
        }))

        try:
            while True:
                data = await websocket.recv()
                data = json.loads(data)
                
                if "error" in data:
                    print('Error del servidor:', data["error"])
                else:
                    print('Datos recibidos del servidor:', data)
                    print(f'Sensor ID: {data["sensor_id"]}, Valor: {data["valor"]}')
        except websockets.ConnectionClosed:
            print('Conexión cerrada.')
        except Exception as error:
            print('Error en la conexión WebSocket:', error)

asyncio.run(connect())
