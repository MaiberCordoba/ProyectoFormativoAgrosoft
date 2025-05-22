from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Q
from django.utils import timezone
from apps.electronica.api.models.sensor import Sensor
from apps.finanzas.api.models.cultivos import CoeficienteCultivo
from django.core.exceptions import ObjectDoesNotExist
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
import logging

logger = logging.getLogger(__name__)

class CalcularEvapotranspiracionView(APIView):
    SENSORES_REQUERIDOS = ['TEM', 'VIE', 'LUM', 'HUM_A']
    FACTOR_LUX = 0.0864
    FACTOR_VIENTO = 0.277778

    def get(self, request):
        plantacion_id = request.query_params.get('plantacion_id')
        kc_param = request.query_params.get('kc')

        try:
            plantacion = self._obtener_plantacion(plantacion_id)
            self._validar_ubicacion(plantacion)
            kc, kc_obj = self._determinar_kc(plantacion, kc_param)
            datos_sensores = self._obtener_datos_sensores(plantacion)
            et_real = self._calcular_evapotranspiracion(datos_sensores, kc)
            
            return Response(
                self._construir_respuesta(et_real, kc, plantacion, datos_sensores, kc_obj),
                status=status.HTTP_200_OK
            )

        except ObjectDoesNotExist as e:
            logger.error(f"Objeto no encontrado: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            logger.warning(f"Error de validación: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.critical(f"Error interno: {str(e)}", exc_info=True)
            return Response({'error': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _obtener_plantacion(self, plantacion_id):
        try:
            return Plantaciones.objects.select_related(
                'fk_Cultivo', 'fk_Era__fk_lote'
            ).get(pk=plantacion_id)
        except Plantaciones.DoesNotExist:
            raise ObjectDoesNotExist("Plantación no encontrada")

    def _validar_ubicacion(self, plantacion):
        if not plantacion.fk_Era or not plantacion.fk_Era.fk_lote:
            raise ValueError("La plantación no tiene una ubicación válida (Lote/Era)")

    def _determinar_kc(self, plantacion, kc_param):
        if kc_param:
            try:
                return float(kc_param), None
            except ValueError:
                raise ValueError("Valor Kc inválido, debe ser un número")
        
        dias_desde_siembra = (timezone.now().date() - plantacion.fechaSiembra).days
        try:
            kc_obj = CoeficienteCultivo.objects.filter(
                cultivo=plantacion.fk_Cultivo,
                dias_desde_siembra__lte=dias_desde_siembra
            ).latest('dias_desde_siembra')
            return kc_obj.kc_valor, kc_obj
        except CoeficienteCultivo.DoesNotExist:
            return 0.7, None

    def _obtener_datos_sensores(self, plantacion):
        era = plantacion.fk_Era
        lote = era.fk_lote if era else None

        sensores = Sensor.objects.filter(
            Q(fk_eras=era) | Q(fk_lote=lote),
            tipo__in=self.SENSORES_REQUERIDOS
        ).values('tipo').annotate(promedio=Avg('valor'))

        datos = {s['tipo']: float(s['promedio']) for s in sensores}
        faltantes = [s for s in self.SENSORES_REQUERIDOS if s not in datos]

        if faltantes:
            raise ValueError(
                f"Sensores faltantes: {', '.join(faltantes)}. " 
                f"Verifique que existen registros para estos sensores."
            )

        return datos

    def _calcular_evapotranspiracion(self, datos, kc):
        try:
            eto = (
                0.408 * datos['TEM'] + 
                0.124 * (datos['LUM'] * self.FACTOR_LUX) +
                0.19 * (datos['VIE'] * self.FACTOR_VIENTO) -
                0.15 * datos['HUM_A']
            )
            return max(eto * kc, 0)
        except KeyError as e:
            logger.error(f"Dato de sensor faltante: {str(e)}")
            raise ValueError(f"Error en datos de sensores: {str(e)}")

    def _construir_respuesta(self, et_real, kc, plantacion, datos_sensores, kc_obj):
        alerta = None
        if kc_obj:
            if et_real < kc_obj.et_minima:
                alerta = {
                    'tipo': 'advertencia',
                    'mensaje': f'ET baja ({et_real:.2f}mm) - Posible exceso de riego',
                    'umbral_min': float(kc_obj.et_minima),
                    'umbral_max': float(kc_obj.et_maxima)
                }
            elif et_real > kc_obj.et_maxima:
                alerta = {
                    'tipo': 'peligro',
                    'mensaje': f'ET alta ({et_real:.2f}mm) - Riesgo de estrés hídrico',
                    'umbral_min': float(kc_obj.et_minima),
                    'umbral_max': float(kc_obj.et_maxima)
                }

        return {
            'evapotranspiracion_mm_dia': round(et_real, 2),
            'kc': round(kc, 2),
            'alerta': alerta,
            'detalles': {
                'cultivo': plantacion.fk_Cultivo.nombre if plantacion.fk_Cultivo else 'Desconocido',
                'lote': plantacion.fk_Era.fk_lote.nombre if plantacion.fk_Era else 'Desconocido',
                'fecha_siembra': plantacion.fechaSiembra,
                'dias_siembra': (timezone.now().date() - plantacion.fechaSiembra).days
            },
            'sensor_data': {
                'temperatura': round(datos_sensores['TEM'], 2),
                'viento': round(datos_sensores['VIE'], 2),
                'iluminacion': round(datos_sensores['LUM'], 2),
                'humedad': round(datos_sensores['HUM_A'], 2)
            }
        }
