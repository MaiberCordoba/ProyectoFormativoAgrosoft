from django.http import JsonResponse
import asyncio
import websockets
import json

async def connect_to_websocket(sensor_id, value):
    """
    Conecta con el servidor WebSocket y envía un mensaje.

    Args:
        sensor_id (int): ID del sensor.
        value (float): Valor a enviar del sensor.
    """
    uri = "ws://127.0.0.1:8000/ws/sensor/"

    try:
        async with websockets.connect(uri) as websocket:
            message = {
                "sensor_id": sensor_id,  
                "valor": value           
            }

            await websocket.send(json.dumps(message))
            print(f"Mensaje enviado: {message}")

            # Espera la respuesta del servidor WebSocket
            response = await websocket.recv()
            print(f"Respuesta del servidor: {response}")

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Conexión cerrada inesperadamente: {e}")
    except websockets.exceptions.InvalidURI as e:
        print(f"URI no válida: {e}")
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"Código de estado no esperado: {e}")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

def run_websocket_client(sensor_id, value):
    """
    Ejecuta el cliente WebSocket de forma asíncrona.

    Args:
        sensor_id (int): ID del sensor.
        value (float): Valor del sensor.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    loop.run_until_complete(connect_to_websocket(sensor_id, value))

def enviar_datos_sensor(request):
    sensor_id = 1
    valor = 23.5

    run_websocket_client(sensor_id, valor)

    return JsonResponse({"status": "success", "message": "Datos enviados"})