from rest_framework.routers import DefaultRouter
from ..views.VariedadViews import VariedadViewSet

VariedadRouter = DefaultRouter()
VariedadRouter.register(prefix='variedad', viewset=VariedadViewSet, basename='variedad')