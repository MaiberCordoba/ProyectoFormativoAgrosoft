from django.urls import re_path
from apps.electronica.api.consumers.sensor_consumer import SensorConsumer

websocket_urlpatterns = [
    re_path(r"ws/sensor/(?P<sensor_name>[\w-]+)/$", SensorConsumer.as_asgi()),
]