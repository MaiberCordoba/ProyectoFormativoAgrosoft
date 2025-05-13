from django.urls import path
from apps.electronica.api.views.sensor_views import SensorHistoryView

urlpatterns = [
    path('sensor/<int:pk>/history/', SensorHistoryView.as_view(), name='sensor-history'),
]
