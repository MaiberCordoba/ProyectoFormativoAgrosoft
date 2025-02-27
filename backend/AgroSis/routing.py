from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path

#routers de los webSockets
websocket_urlpatterns = 

application = ProtocolTypeRouter({
    "websocket": URLRouter(websocket_urlpatterns),
})