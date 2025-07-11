from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Prefetch, Q
from django.utils import timezone
from dateutil.parser import parse as parse_date
from django.core.exceptions import FieldError
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.models.cosechaVenta import VentaCosecha
from apps.trazabilidad.api.models.SemillerosModel import Semilleros
from apps.finanzas.api.models.historialBeneficioCosto import HistorialBeneficioCosto
from apps.trazabilidad.api.models.HerramientasModel import Herramientas
from apps.trazabilidad.api.models.UsosHerramientasModel import UsosHerramientas
from math import isclose

class ListCultivoEconomicViewSet(viewsets.ViewSet):
    """
    ViewSet para operaciones económicas de plantaciones.
    Endpoints:
    - resumen_economico: Resumen de costos, ventas, beneficio y relación B/C por plantación, incluyendo mano de obra de semilleros.
    - historial_beneficio_costo: Historial de registros con filtros por cultivos y fechas.
    """
    
    def _calculate_depreciation(self, tiempos, uso_herramienta):
        """Calcula la depreciación de una herramienta."""
        herramienta = uso_herramienta.fk_Herramienta
        if not herramienta or not tiempos:
            return 0
        vida_util_minutos = getattr(herramienta, 'vida_util', 5 * 365 * 24 * 60)
        costo_por_minuto = herramienta.valorTotal / vida_util_minutos
        return costo_por_minuto * tiempos * uso_herramienta.unidades

    @action(detail=False, methods=['get'])
    def resumen_economico(self, request):
        try:
            # Obtener filtros opcionales
            plantaciones_ids = request.query_params.getlist('plantaciones_ids[]', None)
            cultivos_ids = request.query_params.getlist('cultivos_ids[]', None)

            # Configurar prefetch para plantaciones
            prefetch_cosechas = Prefetch('cosechas_set', queryset=Cosechas.objects.all())
            prefetch_actividades = Prefetch(
                'actividades_set',
                queryset=Actividades.objects.prefetch_related(
                    Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                    Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                    'tiempoactividadcontrol_set'
                )
            )
            plantaciones_qs = Plantaciones.objects.select_related('fk_Cultivo', 'fk_semillero__fk_Cultivo', 'fk_Era').prefetch_related(
                prefetch_cosechas,
                prefetch_actividades
            )
            
            # Aplicar filtros
            if plantaciones_ids:
                plantaciones_ids = [int(pid) for pid in plantaciones_ids if pid.isdigit()]
                plantaciones_qs = plantaciones_qs.filter(id__in=plantaciones_ids)
            if cultivos_ids:
                cultivos_ids = [int(cid) for cid in cultivos_ids if cid.isdigit()]
                plantaciones_qs = plantaciones_qs.filter(
                    Q(fk_Cultivo__id__in=cultivos_ids) |
                    Q(fk_semillero__fk_Cultivo__id__in=cultivos_ids)
                )

            plantaciones = plantaciones_qs.all()

            # Diccionario para acumular totales por cultivo (para historial)
            cultivos_totales = {}

            resumenes = []
            for plantacion in plantaciones:
                # Determinar el cultivo asociado
                cultivo = plantacion.fk_Cultivo or (plantacion.fk_semillero.fk_Cultivo if plantacion.fk_semillero else None)
                if not cultivo:
                    continue  # Saltar plantaciones sin cultivo asociado

                nombre_especie = cultivo.fk_Especie.nombre if cultivo.fk_Especie else None
                nombre_era = plantacion.fk_Era.nombre if plantacion.fk_Era and hasattr(plantacion.fk_Era, 'nombre') else None
                actividades_plantacion = Actividades.objects.filter(fk_Plantacion=plantacion).prefetch_related(
                    Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                    Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                    'tiempoactividadcontrol_set'
                )
                afecciones_ids = Afecciones.objects.filter(fk_Plantacion=plantacion).values_list('id', flat=True)
                controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids).prefetch_related(
                    Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                    Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                    'tiempoactividadcontrol_set'
                )

                # Actividades del semillero (filtradas por fk_Cultivo y tipo de actividad)
                actividades_semillero = []
                if plantacion.fk_semillero:
                    actividades_semillero = Actividades.objects.filter(
                        fk_Cultivo=cultivo,
                        fk_TipoActividad__nombre='creación de semillero'  # Ajustar según el nombre real
                    ).prefetch_related(
                        Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                        Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                        'tiempoactividadcontrol_set'
                    )

                # Costos de insumos
                insumos_actividades_plantacion = UsosInsumos.objects.filter(fk_Actividad__in=actividades_plantacion).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                insumos_actividades_semillero = UsosInsumos.objects.filter(fk_Actividad__in=actividades_semillero).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                insumos_controles = UsosInsumos.objects.filter(fk_Control__in=controles).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                total_insumos = int(round(float(insumos_actividades_plantacion) + float(insumos_actividades_semillero) + float(insumos_controles)))

                # Mano de obra
                mano_obra_actividades_plantacion = TiempoActividadControl.objects.filter(fk_actividad__in=actividades_plantacion).aggregate(total=Sum('valorTotal'))['total'] or 0
                mano_obra_actividades_semillero = TiempoActividadControl.objects.filter(fk_actividad__in=actividades_semillero).aggregate(total=Sum('valorTotal'))['total'] or 0
                mano_obra_controles = TiempoActividadControl.objects.filter(fk_control__in=controles).aggregate(total=Sum('valorTotal'))['total'] or 0
                total_mano_obra = int(round(float(mano_obra_actividades_plantacion) + float(mano_obra_actividades_semillero) + float(mano_obra_controles)))

                # Depreciación
                total_depreciacion = 0
                for actividad in actividades_plantacion:
                    tiempos = actividad.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                    for uso_herramienta in actividad.usosherramientas_set.all():
                        total_depreciacion += self._calculate_depreciation(tiempos, uso_herramienta)
                for actividad in actividades_semillero:
                    tiempos = actividad.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                    for uso_herramienta in actividad.usosherramientas_set.all():
                        total_depreciacion += self._calculate_depreciation(tiempos, uso_herramienta)
                for control in controles:
                    tiempos = control.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                    for uso_herramienta in control.usosherramientas_set.all():
                        total_depreciacion += self._calculate_depreciation(tiempos, uso_herramienta)
                total_depreciacion = int(round(total_depreciacion))

                # Ventas
                cosechas_ids = plantacion.cosechas_set.values_list('id', flat=True)
                total_ventas = VentaCosecha.objects.filter(cosecha__id__in=cosechas_ids).aggregate(total=Sum('valor_total'))['total'] or 0

                total_costos = total_insumos + total_mano_obra + total_depreciacion
                beneficio = total_ventas - total_costos
                relacion_bc = round(float(total_ventas) / total_costos, 2) if total_costos > 0 else 0.0

                # Fecha de siembra
                fecha_siembra = plantacion.fechaSiembra

                # Acumular totales por cultivo para historial
                cultivo_id = cultivo.id
                if cultivo_id not in cultivos_totales:
                    cultivos_totales[cultivo_id] = {
                        'costo_insumos': 0,
                        'total_mano_obra': 0,
                        'total_depreciacion': 0,
                        'total_costos': 0,
                        'total_ventas': 0,
                        'beneficio': 0,
                        'cultivo': cultivo
                    }
                cultivos_totales[cultivo_id]['costo_insumos'] += total_insumos
                cultivos_totales[cultivo_id]['total_mano_obra'] += total_mano_obra
                cultivos_totales[cultivo_id]['total_depreciacion'] += total_depreciacion
                cultivos_totales[cultivo_id]['total_costos'] += total_costos
                cultivos_totales[cultivo_id]['total_ventas'] += total_ventas
                cultivos_totales[cultivo_id]['beneficio'] += beneficio

                # Resumen por plantación
                resumen = {
                    "plantacion_id": plantacion.id,
                    "cultivo_id": cultivo_id,
                    "nombre_especie": nombre_especie,
                    "nombre_cultivo": cultivo.nombre,
                    "fecha_siembra": fecha_siembra.strftime("%Y-%m-%d") if fecha_siembra else None,
                    "nombre_era": nombre_era,
                    "costo_insumos": total_insumos,
                    "total_mano_obra": total_mano_obra,
                    "mano_obra_semillero": int(round(float(mano_obra_actividades_semillero))),
                    "total_depreciacion": total_depreciacion,
                    "total_costos": total_costos,
                    "total_ventas": int(round(total_ventas)),
                    "beneficio": int(round(beneficio)),
                    "relacion_beneficio_costo": relacion_bc
                }
                resumenes.append(resumen)

            # Actualizar historial por cultivo
            for cultivo_id, totales in cultivos_totales.items():
                cultivo = totales['cultivo']
                total_costos = totales['total_costos']
                relacion_bc = round(float(totales['total_ventas']) / total_costos, 2) if total_costos > 0 else 0.0
                ultimo_historial = HistorialBeneficioCosto.objects.filter(fk_Cultivo=cultivo).order_by('-fecha_registro').first()
                crear_registro = True
                if ultimo_historial:
                    crear_registro = (
                        not isclose(ultimo_historial.costo_insumos, totales['costo_insumos'], rel_tol=1e-2) or
                        not isclose(ultimo_historial.total_mano_obra, totales['total_mano_obra'], rel_tol=1e-2) or
                        not isclose(ultimo_historial.total_depreciacion, totales['total_depreciacion'], rel_tol=1e-2) or
                        not isclose(ultimo_historial.total_costos, total_costos, rel_tol=1e-2) or
                        not isclose(ultimo_historial.total_ventas, totales['total_ventas'], rel_tol=1e-2) or
                        not isclose(ultimo_historial.beneficio, totales['beneficio'], rel_tol=1e-2) or
                        not isclose(ultimo_historial.relacion_beneficio_costo, relacion_bc, rel_tol=1e-2)
                    )
                if crear_registro:
                    HistorialBeneficioCosto.objects.create(
                        fk_Cultivo=cultivo,
                        costo_insumos=totales['costo_insumos'],
                        total_mano_obra=totales['total_mano_obra'],
                        total_depreciacion=totales['total_depreciacion'],
                        total_costos=total_costos,
                        total_ventas=totales['total_ventas'],
                        beneficio=totales['beneficio'],
                        relacion_beneficio_costo=relacion_bc,
                        fecha_registro=timezone.now()
                    )

            return Response(resumenes)
        except ValueError as e:
            return Response(
                {"error": f"Error de validación: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except (Cultivos.DoesNotExist, Semilleros.DoesNotExist):
            return Response(
                {"error": "Uno o más cultivos o semilleros no encontrados"},
                status=status.HTTP_404_NOT_FOUND
            )
        except FieldError as e:
            return Response(
                {"error": f"Error en la consulta de datos: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Error interno: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='historial-beneficio-costo')
    def historial_beneficio_costo(self, request):
        try:
            cultivos_ids = request.query_params.getlist('cultivos_ids[]', None)
            fecha_inicio = request.query_params.get('fecha_inicio', None)
            fecha_fin = request.query_params.get('fecha_fin', None)

            historial_qs = HistorialBeneficioCosto.objects.select_related('fk_Cultivo')
            if cultivos_ids:
                cultivos_ids = [int(cid) for cid in cultivos_ids if cid.isdigit()]
                historial_qs = historial_qs.filter(fk_Cultivo__id__in=cultivos_ids)
            if fecha_inicio:
                try:
                    parse_date(fecha_inicio)
                    historial_qs = historial_qs.filter(fecha_registro__gte=fecha_inicio)
                except ValueError:
                    return Response(
                        {"error": "Formato de fecha_inicio inválido. Use YYYY-MM-DD"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            if fecha_fin:
                try:
                    parse_date(fecha_fin)
                    historial_qs = historial_qs.filter(fecha_registro__lte=fecha_fin)
                except ValueError:
                    return Response(
                        {"error": "Formato de fecha_fin inválido. Use YYYY-MM-DD"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            historial_qs = historial_qs.order_by('fk_Cultivo__id', '-fecha_registro')
            historial_data = [{
                "cultivo_id": registro.fk_Cultivo.id,
                "nombre_cultivo": registro.fk_Cultivo.nombre,
                "fecha_registro": registro.fecha_registro.strftime("%Y-%m-%d %H:%M:%S"),
                "costo_insumos": registro.costo_insumos,
                "total_mano_obra": registro.total_mano_obra,
                "total_depreciacion": registro.total_depreciacion,
                "total_costos": registro.total_costos,
                "total_ventas": registro.total_ventas,
                "beneficio": registro.beneficio,
                "relacion_beneficio_costo": registro.relacion_beneficio_costo
            } for registro in historial_qs]
            return Response(historial_data)
        except Cultivos.DoesNotExist:
            return Response(
                {"error": "Uno o más cultivos no encontrados"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError as e:
            return Response(
                {"error": f"Error de validación: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Error interno: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )