"""
URL configuration for AgroSis project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
#IMPORTACIONES GENERALES
from django.contrib import admin
from django.urls import path,include

#IMPORTACION DE SWAGGER DOCS GENERATOR
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

#JWT
from rest_framework_simplejwt import views as jwt_views

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

#Routers

#Electronica
from apps.electronica.api.routers.era_router import router_era
from apps.electronica.api.routers.lote_router import router_Lote
from apps.electronica.api.routers.sensor_router import router_sensor

#Trazabilidad
from apps.trazabilidad.api.routers.EspeciesRouter import EspeciesRouter
from apps.trazabilidad.api.routers.HerramientasRouter import HerramientasRouter
from apps.trazabilidad.api.routers.PlantacionesRouter import PlantacionesRouter
from apps.trazabilidad.api.routers.SemillerosRouter import SemillerosRouter
from apps.trazabilidad.api.routers.TiposEspeciesRouter import TiposEspecieRouter
from apps.trazabilidad.api.routers.UsosHerramientasRouter import UsosHerramientasRouter

#Sanidad
from apps.sanidad.api.routers.tipoPlagaRouter import router_tipoPlaga
from apps.sanidad.api.routers.plagaRouter import router_plaga
from apps.sanidad.api.routers.afeccionesRouter import router_afecciones
from apps.sanidad.api.routers.tiposControlRouter import router_tiposControl
from apps.sanidad.api.routers.controlesRouter import router_controles
from apps.sanidad.api.routers.productosControlRouter import router_productosControl
from apps.sanidad.api.routers.UsosProductosControlRouter import router_usoProductosControl

#Finanzas
from apps.finanzas.api.routers.routerActividades import routerActividades
from apps.finanzas.api.routers.routerCosechas import routerCosechas
from apps.finanzas.api.routers.routerCultivos import routerCultivos
from apps.finanzas.api.routers.routerDesechos import routerDesechos
from apps.finanzas.api.routers.routerHorasMensuales import routerHorasMensuales
from apps.finanzas.api.routers.routerInsumos import routerInsumos
from apps.finanzas.api.routers.routerPasantes import routerPasantes
from apps.finanzas.api.routers.routerTiposDesechos import routerTiposDesecho
from apps.finanzas.api.routers.routerUsosProductos import routerUsosProductos
from apps.finanzas.api.routers.routerVentas import routerVentas

urlpatterns = [
    #SWAGGER Y ADMIN
    path('admin/', admin.site.urls),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    #Routers | EMPEZAR A PARTIR DE ESTA LÍNEA
    
    #Electronica
    path('api/',include(router_era.urls)),
    path('api/',include(router_Lote.urls)),
    path('api/',include(router_sensor.urls)),
    
    #Trazabilidad
    path('api/',include(EspeciesRouter.urls)),
    path('api/',include(TiposEspecieRouter.urls)),
    path('api/',include(HerramientasRouter.urls)),
    path('api/',include(PlantacionesRouter.urls)),
    path('api/',include(SemillerosRouter.urls)),
    path('api/',include(UsosHerramientasRouter.urls)),
    
    #Sanidad
    path("api/", include(router_tipoPlaga.urls)),
    path("api/", include(router_plaga.urls)),
    path("api/", include(router_afecciones.urls)),
    path("api/", include(router_tiposControl.urls)),
    path("api/", include(router_controles.urls)),
    path("api/", include(router_productosControl.urls)),
    path("api/", include(router_usoProductosControl.urls)),

    #Finanzas
    path('api/',include(routerActividades.urls)),
    path('api/',include(routerCosechas.urls)),
    path('api/',include(routerCultivos.urls)),
    path('api/',include(routerDesechos.urls)),
    path('api/',include(routerHorasMensuales.urls)),
    path('api/',include(routerInsumos.urls)),
    path('api/',include(routerPasantes.urls)),
    path('api/',include(routerTiposDesecho.urls)),
    path('api/',include(routerUsosProductos.urls)),
    path('api/',include(routerVentas.urls)),

    # Ruta para obtener el token JWT
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Ruta para refrescar el token JWT
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
