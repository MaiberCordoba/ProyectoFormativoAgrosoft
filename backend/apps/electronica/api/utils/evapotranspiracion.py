from apps.electronica.api.models.sensor import Sensor
from apps.finanzas.api.models.cultivos import Cultivos, CoeficienteCultivo
from datetime import timedelta
from django.utils import timezone

def obtener_valores_sensores(lote_id):
    ahora = timezone.now()
    hace_1_hora = ahora - timedelta(hours=1)

    sensores = Sensor.objects.filter(fk_lote_id=lote_id, fecha__range=(hace_1_hora, ahora))

    datos = {
        'TEM': None,
        'LUM': None,
        'HUM_A': None,
        'VIE': None
    }

    for tipo in datos:
        valor = sensores.filter(tipo=tipo).order_by('-fecha').first()
        if valor:
            datos[tipo] = float(valor.valor)

    return datos

def calcular_eto_con_sensores(datos):
    T = datos['TEM'] or 25
    Rs = datos['LUM'] or 15
    RH = datos['HUM_A'] or 60
    u2 = datos['VIE'] or 2

    eto = 0.408 * (0.6108 * (T / (T + 237.3))) + (900 / (T + 273)) * u2 * (1 - RH / 100)
    return round(eto, 2)

def calcular_evapotranspiracion_total(cultivo_id, lote_id):
    cultivo = Cultivos.objects.get(id=cultivo_id)
    coef_kc = CoeficienteCultivo.objects.filter(cultivo=cultivo).order_by('-id').first()
    if not coef_kc:
        raise ValueError("No se encontró un coeficiente Kc para este cultivo.")

    datos = obtener_valores_sensores(lote_id)
    eto = calcular_eto_con_sensores(datos)
    kc = coef_kc.kc_valor

    etc = eto * kc
    return {
        "ETo": eto,
        "Kc": float(kc),
        "ETc": round(etc, 2),
        "unidad": "mm/día",
        "fase_crecimiento": coef_kc.fase_crecimiento,
        "cultivo": str(cultivo),
        "detalles": datos
    }
