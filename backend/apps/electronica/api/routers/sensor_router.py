from rest_framework.routers import DefaultRouter
from apps.electronica.api.views.sensor_views import *

router_sensor = DefaultRouter()
router_sensor.register(prefix= 'sensor', viewset= sensoresview, basename='sensor')
