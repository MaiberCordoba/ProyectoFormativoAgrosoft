from rest_framework.routers import DefaultRouter
from apps.electronica.api.views.umbral_views import *

router_umbral = DefaultRouter()
router_umbral.register(prefix= 'umbral', viewset= Erasview, basename='umbral')