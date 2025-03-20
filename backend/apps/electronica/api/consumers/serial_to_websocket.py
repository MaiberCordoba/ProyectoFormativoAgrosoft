import serial
import json
import asyncio
import websockets

SERIAL_PORT = "COM3"  
BAUD_RATE = 115200
WEBSOCKET_URL = "ws://localhost:8000/ws/sensor/"

async def enviar_datos():
    with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1) as ser:
        print("📡 Conectado al Arduino...")
        while True:
            try:
                linea = ser.readline().decode("utf-8").strip()
                if linea:
                    datos = json.loads(linea)
                    temperatura = datos.get("temperatura")
                    humedad = datos.get("humedad")
                    luz = datos.get("luz")

                    sensor_data = {
                        "action": "update_sensor",
                        "sensor_id": 1,
                        "valor": temperatura
                    }

                    async with websockets.connect(WEBSOCKET_URL) as websocket:
                        await websocket.send(json.dumps(sensor_data))
                        print(f"📤 Datos enviados: {sensor_data}")

            except json.JSONDecodeError:
                print("⚠️ Error en el formato JSON")
            except Exception as e:
                print(f"❌ Error: {e}")

asyncio.run(enviar_datos())
