from django.urls import re_path
from apps.electronica.api.consumers.sensor import SensorConsumer

websocket_urlpatterns = [
    re_path(r"ws/sensor/(?P<sensor_id>\w+)/$", SensorConsumer.as_asgi()),
]