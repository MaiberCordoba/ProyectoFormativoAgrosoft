import os
import sys
import django
import asyncio
import json
import random
from channels.layers import get_channel_layer

sys.path.append("C:/Users/Adminsena/Desktop/Maiber/adsocasa/backend")


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "AgroSis.settings")  
django.setup()

channel_layer = get_channel_layer()

async def enviar_datos_sensor():
    sensor_id = 1  
    while True:
        temperatura = round(random.uniform(10, 45), 2)

        alerta = None
        if temperatura > 35:
            alerta = "🔥 ¡Hace mucho calor!"
        elif temperatura < 15:
            alerta = "❄️ ¡Hace mucho frío!"

        data = {
            "type": "sensor_update", 
            "mensaje_sensor": {
                "sensor_id": sensor_id,
                "valor": temperatura,
                "tipo": "TEM",
                "timestamp": "2025-02-21T12:00:00Z",
                "alerta": alerta
            }
        }

        await channel_layer.group_send(f"sensor_{sensor_id}", data)
        
        print(f"📡 Enviado: {data}")
        await asyncio.sleep(5) 

asyncio.run(enviar_datos_sensor())

