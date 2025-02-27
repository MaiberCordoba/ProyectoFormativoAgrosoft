"""
ASGI config for AgroSis project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
#archivo de rutas WebSocket
from AgroSis import routing    

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AgroSis.settings')

django.setup()

#define que tipo de protocolos seguira manejando Django
application = ProtocolTypeRouter({   
    #Sigue manejando peticiones HTTP
    "http": get_asgi_application(), 
    # Maneja conexiones WebSocket 
    "websocket": AuthMiddlewareStack(  
        #Ruta de WebSockets
        URLRouter(
            routing.websocket_urlpatterns 
        )
    ),
})