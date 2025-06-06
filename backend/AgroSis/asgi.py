"""
ASGI config for AgroSis project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

# asgi.py
import os
import django 

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "AgroSis.settings")
django.setup() 

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
#from apps.electronica.api.consumers.routing import websocket_urlpatterns
from AgroSis import routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(routing.websocket_urlpatterns)  
    ),

}) 
