from django.urls import path
from apps.electronica.api.consumers.sensor_consumer import SensorConsumer
from apps.electronica.api.consumers.eras_consumer import ErasConsumer
from apps.electronica.api.consumers.lote_comsumer import LoteConsumer 

websocket_urlpatterns = [
    path('ws/sensores/', SensorConsumer.as_asgi()),  
    path('ws/eras/', ErasConsumer.as_asgi()), 
    path('ws/lote/', LoteConsumer.as_asgi()),
]