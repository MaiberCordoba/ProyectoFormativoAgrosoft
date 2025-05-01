from django.urls import path
from apps.electronica.api.views.evapotranspiracion_views import CalcularEvapotranspiracionView

urlpatterns = [
    path('evapotranspiracion/', CalcularEvapotranspiracionView.as_view(), name='evapotranspiracion'),
]
