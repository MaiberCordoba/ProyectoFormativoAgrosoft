from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from apps.finanzas.websocket.routing import websocket_urlpatterns as actividades_routing

#routers de los webSockets
websocket_urlpatterns = actividades_routing

application = ProtocolTypeRouter({
    "websocket": URLRouter(websocket_urlpatterns),
})