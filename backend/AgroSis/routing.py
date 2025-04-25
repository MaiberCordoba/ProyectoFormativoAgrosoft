from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from apps.finanzas.websocket.routing import websocket_urlpatterns as actividades_routing
#from apps.electronica.api.consumers.routing import websocket_urlpatterns as electronica_routing

#routers de los webSockets
websocket_urlpatterns = actividades_routing #+ electronica_routing

application = ProtocolTypeRouter({
    "websocket": URLRouter(websocket_urlpatterns),
})