from rest_framework.routers import DefaultRouter
from django.urls import path
from apps.electronica.api.views.sensor_views import *

# sensor_router.py
router_sensor = DefaultRouter()
router_sensor.register(prefix='sensor', viewset=SensoresView, basename='sensor')

# historic_data_router.py
urlpatterns = [
    path('sensor/history/', SensorHistoryView.as_view(), name='sensor-history'),
    path('sensor/<int:pk>/history/', SensorHistoryView.as_view(), name='sensor-specific-history'),
]