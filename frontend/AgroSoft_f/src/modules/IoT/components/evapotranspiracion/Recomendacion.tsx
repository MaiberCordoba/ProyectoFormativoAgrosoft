// src/components/RecomendacionesDetalladas.tsx
import { useState, useMemo, useCallback } from "react";
import { 
  Card,
  CardBody,
  CardHeader,
  Badge,
  Spinner,
  Chip
} from "@heroui/react";
import { 
  Droplet, 
  ThermometerSun,
  Leaf,
  Zap,
  Droplets,
  Scissors
} from "lucide-react";

interface Recomendacion {
  tipo: 'riego' | 'nutricion' | 'proteccion' | 'manejo' | 'monitoreo';
  titulo: string;
  mensaje: string;
  severidad: 'info' | 'advertencia' | 'urgente';
  accion: string;
  icon: JSX.Element;
  detalles: string[];
}

interface Props {
  cultivo: {
    id: string;
    nombre: string;
    dias_siembra: number;
  };
  datosActuales: {
    et: number;
    kc: number;
    temperatura: number;
    humedad_suelo: number;
    humedad_ambiente: number;
    estado_humedad: string;
  };
}

export default function RecomendacionesDetalladas({ cultivo, datosActuales }: Props) {
  const [loading, setLoading] = useState(true);
  
  const cultivoInfo = useMemo(() => {
    if (!cultivo) return null;
    
    interface CropStage {
      kc: number;
      duration: string; 
    }

    interface Crop {
      name: string;
      stages: CropStage[];
      totalDays: number;
    }

    interface CropCategory {
      name: string;
      crops: Crop[];
    }

    const cropCategories: CropCategory[] = [
    {
        name: 'Hortalizas de Hoja',
        crops: [
            { name: 'Lechuga', stages: [{ kc: 0.4, duration: '1-20' }, { kc: 0.8, duration: '21-40' }, { kc: 1.05, duration: '41-60' }, { kc: 0.9, duration: '61-75' }], totalDays: 75 },
            { name: 'Acelga', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-50' }, { kc: 1.05, duration: '51-70' }, { kc: 0.9, duration: '71-85' }], totalDays: 85 },
            { name: 'Espinaca', stages: [{ kc: 0.4, duration: '1-20' }, { kc: 0.7, duration: '21-40' }, { kc: 1.0, duration: '41-55' }, { kc: 0.8, duration: '56-65' }], totalDays: 65 },
            { name: 'Repollo', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.9, duration: '31-60' }, { kc: 1.15, duration: '61-85' }, { kc: 0.95, duration: '86-100' }], totalDays: 100 },
            { name: 'Repollo morado', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.9, duration: '31-60' }, { kc: 1.15, duration: '61-85' }, { kc: 0.95, duration: '86-100' }], totalDays: 100 },
            { name: 'Col rizada', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.9, duration: '31-60' }, { kc: 1.15, duration: '61-85' }, { kc: 0.95, duration: '86-100' }], totalDays: 100 },
            { name: 'Cebolla', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-70' }, { kc: 1.10, duration: '71-100' }, { kc: 0.75, duration: '101-130' }], totalDays: 130 },        
        ]
    },
    {
        name: 'Raíces y Tubérculos',
        crops: [
            { name: 'Zanahoria', stages: [{ kc: 0.4, duration: '1-30' }, { kc: 0.8, duration: '31-70' }, { kc: 1.10, duration: '71-100' }, { kc: 0.95, duration: '101-130' }], totalDays: 130 },
            { name: 'Remolacha', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-60' }, { kc: 1.10, duration: '61-90' }, { kc: 0.95, duration: '91-110' }], totalDays: 110 },
            { name: 'Rábano', stages: [{ kc: 0.4, duration: '1-15' }, { kc: 0.7, duration: '16-30' }, { kc: 1.0, duration: '31-45' }, { kc: 0.8, duration: '46-55' }], totalDays: 55 },
            { name: 'Papa', stages: [{ kc: 0.45, duration: '1-30' }, { kc: 0.85, duration: '31-60' }, { kc: 1.15, duration: '61-90' }, { kc: 0.75, duration: '91-120' }], totalDays: 120 },
            { name: 'Arracacha', stages: [{ kc: 0.5, duration: '1-60' }, { kc: 0.9, duration: '61-150' }, { kc: 1.10, duration: '151-220' }, { kc: 0.95, duration: '221-270' }], totalDays: 270 },
        ]
    },
    {
        name: 'Frutas y Hortalizas de Fruto',
        crops: [
            { name: 'Tomate', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-60' }, { kc: 1.20, duration: '61-110' }, { kc: 0.80, duration: '111-140' }], totalDays: 140 },
            { name: 'Pepino', stages: [{ kc: 0.5, duration: '1-25' }, { kc: 0.8, duration: '26-50' }, { kc: 1.10, duration: '51-80' }, { kc: 0.85, duration: '81-100' }], totalDays: 100 },
            { name: 'Sandía', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-60' }, { kc: 1.10, duration: '61-90' }, { kc: 0.85, duration: '91-110' }], totalDays: 110 },
            { name: 'Auyama', stages: [{ kc: 0.5, duration: '1-35' }, { kc: 0.8, duration: '36-70' }, { kc: 1.05, duration: '71-100' }, { kc: 0.85, duration: '101-130' }], totalDays: 130 },
            { name: 'Melón', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-65' }, { kc: 1.10, duration: '66-95' }, { kc: 0.85, duration: '96-115' }], totalDays: 115 },
            { name: 'Pimentón', stages: [{ kc: 0.5, duration: '1-30' }, { kc: 0.8, duration: '31-60' }, { kc: 1.15, duration: '61-120' },{ kc: 0.85, duration: '121-150' }], totalDays: 150}
        ]
    },
    {
        name: 'Leguminosas',
        crops: [
            { name: 'Frijol', stages: [{ kc: 0.4, duration: '1-20' }, { kc: 0.8, duration: '21-45' }, { kc: 1.10, duration: '46-70' }, { kc: 0.7, duration: '71-85' }], totalDays: 85 },
            { name: 'Arveja', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-50' }, { kc: 1.10, duration: '51-75' }, { kc: 0.7, duration: '76-90' }], totalDays: 90 },
            { name: 'Lenteja', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-55' }, { kc: 1.10, duration: '56-85' }, { kc: 0.7, duration: '86-100' }], totalDays: 100 },
            { name: 'Garbanzo', stages: [{ kc: 0.4, duration: '1-30' }, { kc: 0.8, duration: '31-70' }, { kc: 1.10, duration: '71-110' }, { kc: 0.7, duration: '111-130' }], totalDays: 130 },
        ]
    },
    {
        name: 'Hierbas y Condimentos',
        crops: [
            { name: 'Cilantro', stages: [{ kc: 0.35, duration: '1-15' }, { kc: 0.70, duration: '16-35' }, { kc: 1.00, duration: '36-50' }, { kc: 0.75, duration: '51-60' }], totalDays: 60 },
            { name: 'Perejil', stages: [{ kc: 0.40, duration: '1-20' }, { kc: 0.75, duration: '21-45' }, { kc: 1.05, duration: '46-65' }, { kc: 0.85, duration: '66-80' }], totalDays: 80 },
            { name: 'Albahaca', stages: [{ kc: 0.45, duration: '1-20' }, { kc: 0.85, duration: '21-50' }, { kc: 1.15, duration: '51-80' }, { kc: 0.95, duration: '81-100' }], totalDays: 100 },
            { name: 'Menta', stages: [{ kc: 0.50, duration: '1-30' }, { kc: 0.95, duration: '31-70' }, { kc: 1.20, duration: '71-110' }, { kc: 1.05, duration: '111-150' }], totalDays: 150 },
            { name: 'Orégano', stages: [{ kc: 0.40, duration: '1-30' }, { kc: 0.75, duration: '31-70' }, { kc: 1.00, duration: '71-110' }, { kc: 0.65, duration: '111-150' }], totalDays: 150 },
            { name: 'Romero', stages: [{ kc: 0.35, duration: '1-40' }, { kc: 0.65, duration: '41-100' }, { kc: 0.90, duration: '101-160' }, { kc: 0.60, duration: '161-200' }], totalDays: 200 },
            { name: 'Tomillo', stages: [{ kc: 0.30, duration: '1-30' }, { kc: 0.60, duration: '31-80' }, { kc: 0.85, duration: '81-130' }, { kc: 0.55, duration: '131-170' }], totalDays: 170 },
            { name: 'Salvia', stages: [{ kc: 0.40, duration: '1-25' }, { kc: 0.80, duration: '26-60' }, { kc: 1.10, duration: '61-100' }, { kc: 0.85, duration: '101-130' }], totalDays: 130 },
            { name: 'Eneldo', stages: [{ kc: 0.40, duration: '1-20' }, { kc: 0.85, duration: '21-50' }, { kc: 1.10, duration: '51-80' }, { kc: 0.70, duration: '81-100' }], totalDays: 100 },
            { name: 'Laurel', stages: [{ kc: 0.35, duration: '1-50' }, { kc: 0.70, duration: '51-120' }, { kc: 0.95, duration: '121-200' }, { kc: 0.75, duration: '201-300' }], totalDays: 300 }
        ]
    },
    {
        name: 'Cereales y Granos',
        crops: [
            { name: 'Maíz', stages: [{ kc: 0.4, duration: '1-25' }, { kc: 0.8, duration: '26-60' }, { kc: 1.20, duration: '61-100' }, { kc: 0.70, duration: '101-130' }], totalDays: 130 },
            { name: 'Trigo', stages: [{ kc: 0.3, duration: '1-30' }, { kc: 0.7, duration: '31-70' }, { kc: 1.15, duration: '71-100' }, { kc: 0.5, duration: '101-130' }], totalDays: 130 },
            { name: 'Arroz', stages: [{ kc: 1.1, duration: '1-20' }, { kc: 1.2, duration: '21-50' }, { kc: 1.25, duration: '51-90' }, { kc: 1.0, duration: '91-120' }], totalDays: 120 },
            { name: 'Cebada', stages: [{ kc: 0.3, duration: '1-25' }, { kc: 0.7, duration: '26-60' }, { kc: 1.15, duration: '61-95' }, { kc: 0.45, duration: '96-120' }], totalDays: 120 }
        ]
    },
    {
        name: 'Cultivos Tropicales',
        crops: [
            { name: 'Plátano', stages: [{ kc: 0.6, duration: '1-120' }, { kc: 1.0, duration: '121-300' }, { kc: 1.20, duration: '301-450' }, { kc: 1.10, duration: '451-540' }], totalDays: 540 },
            { name: 'Banano', stages: [{ kc: 0.6, duration: '1-120' }, { kc: 1.0, duration: '121-300' }, { kc: 1.20, duration: '301-450' }, { kc: 1.10, duration: '451-540' }], totalDays: 540 },
            { name: 'Piña', stages: [{ kc: 0.5, duration: '1-180' }, { kc: 0.8, duration: '181-360' }, { kc: 1.0, duration: '361-480' }, { kc: 0.9, duration: '481-600' }], totalDays: 600 },
            { name: 'Mango', stages: [{ kc: 0.6, duration: '1-365' }, { kc: 0.9, duration: '366-730' }, { kc: 1.1, duration: '731-1095' }, { kc: 1.0, duration: '1096-1460' }], totalDays: 1460 },
        ]
    },
];

    for (const category of cropCategories) {
      const foundCrop = category.crops.find((c: Crop) => 
        c.name.toLowerCase() === cultivo.nombre.toLowerCase()
      );
      
      if (foundCrop) {
        let etapaActual = null;
        for (let i = 0; i < foundCrop.stages.length; i++) {
          const [start, end] = foundCrop.stages[i].duration.split('-').map(Number);
          if (cultivo.dias_siembra >= start && cultivo.dias_siembra <= end) {
            etapaActual = {
              numero: i + 1,
              kcRecomendado: foundCrop.stages[i].kc,
              duracion: foundCrop.stages[i].duration,
              diasTotales: foundCrop.totalDays
            };
            break;
          }
        }
        
        return {
          ...foundCrop,
          categoria: category.name,
          etapaActual
        };
      }
    }
    return null;
  }, [cultivo]);

  // Calcular déficit de riego
  const calcularDeficitRiego = useCallback((
    etActual: number, 
    kcActual: number, 
    kcRecomendado: number | undefined,
    humedadSuelo: number
  ): number => {
    // Si tenemos Kc recomendado, usamos esa referencia
    if (kcRecomendado !== undefined) {
      const etRecomendada = etActual * (kcRecomendado / kcActual);
      return Math.max(0, etRecomendada - etActual);
    }
    
    // Si no, usamos la humedad del suelo como referencia
    if (humedadSuelo < 40) return 5.0;
    if (humedadSuelo < 60) return 2.5;
    return 0;
  }, []);

  // Generar recomendaciones
  const recomendaciones = useMemo(() => {
    if (!cultivo || !datosActuales) return [];
    
    const nuevasRecomendaciones: Recomendacion[] = [];
    
    // 1. Recomendaciones de riego
    const deficitRiego = calcularDeficitRiego(
      datosActuales.et, 
      datosActuales.kc, 
      cultivoInfo?.etapaActual?.kcRecomendado,
      datosActuales.humedad_suelo
    );
    
    if (deficitRiego > 0) {
      nuevasRecomendaciones.push({
        tipo: 'riego',
        titulo: "Necesidad de riego inmediato",
        mensaje: `El cultivo muestra un déficit de agua de ${deficitRiego.toFixed(1)} mm/día`,
        severidad: 'urgente',
        accion: `Aplicar riego equivalente a ${deficitRiego.toFixed(1)} mm (${(deficitRiego * 10).toFixed(1)} L/m²) en las próximas 24 horas`,
        icon: <Droplet className="text-blue-500" />,
        detalles: [
          `ETc actual: ${datosActuales.et.toFixed(2)} mm/día`,
          `Kc actual: ${datosActuales.kc.toFixed(2)}`,
          `Kc recomendado para esta etapa: ${cultivoInfo?.etapaActual?.kcRecomendado?.toFixed(2) || 'N/A'}`,
          `Humedad del suelo: ${datosActuales.humedad_suelo}% (${datosActuales.estado_humedad})`
        ]
      });
    } else if (datosActuales.estado_humedad === 'alto') {
      nuevasRecomendaciones.push({
        tipo: 'riego',
        titulo: "Exceso de humedad",
        mensaje: "La humedad del suelo está por encima de los niveles óptimos",
        severidad: 'advertencia',
        accion: "Suspender riego por 48 horas y revisar drenaje",
        icon: <Droplets className="text-blue-500" />,
        detalles: [
          `Humedad del suelo: ${datosActuales.humedad_suelo}%`,
          "El exceso de agua puede causar pudrición de raíces",
          "Mejorar el drenaje del suelo si el problema persiste"
        ]
      });
    } else {
      nuevasRecomendaciones.push({
        tipo: 'riego',
        titulo: "Riego adecuado",
        mensaje: "Los niveles de humedad del suelo son óptimos",
        severidad: 'info',
        accion: "Continuar con el programa de riego actual",
        icon: <Droplet className="text-green-500" />,
        detalles: [
          `ETc actual: ${datosActuales.et.toFixed(2)} mm/día`,
          `Humedad del suelo: ${datosActuales.humedad_suelo}%`,
          `Estado: ${datosActuales.estado_humedad}`
        ]
      });
    }
    
    // 2. Recomendaciones de protección según temperatura
    if (datosActuales.temperatura > 30) {
      nuevasRecomendaciones.push({
        tipo: 'proteccion',
        titulo: "Protección contra calor",
        mensaje: "Temperaturas altas pueden causar estrés térmico",
        severidad: 'advertencia',
        accion: "Instalar malla de sombreo durante horas pico (11am-3pm)",
        icon: <ThermometerSun className="text-amber-600" />,
        detalles: [
          `Temperatura actual: ${datosActuales.temperatura}°C`,
          "Las altas temperaturas pueden reducir la fotosíntesis",
          "Aumentar la frecuencia de riego para enfriar el cultivo"
        ]
      });
    } else if (datosActuales.temperatura < 10) {
      nuevasRecomendaciones.push({
        tipo: 'proteccion',
        titulo: "Protección contra frío",
        mensaje: "Temperaturas bajas pueden dañar el cultivo",
        severidad: 'advertencia',
        accion: "Cubrir cultivos con tela antiheladas durante la noche",
        icon: <ThermometerSun className="text-blue-500" />,
        detalles: [
          `Temperatura actual: ${datosActuales.temperatura}°C`,
          "El frío puede ralentizar el crecimiento",
          "Considerar el uso de túneles de protección"
        ]
      });
    }
    
    // 3. Recomendaciones específicas por tipo de cultivo
    if (cultivoInfo) {
      // Para hortalizas de hoja
      if (cultivoInfo.categoria === 'Hortalizas de Hoja') {
        nuevasRecomendaciones.push({
          tipo: 'nutricion',
          titulo: "Fertilización para hortalizas",
          mensaje: "Las hortalizas de hoja requieren nitrógeno para crecimiento foliar",
          severidad: 'info',
          accion: "Aplicar fertilizante nitrogenado (20-10-10) a razón de 150g/m²",
          icon: <Leaf className="text-green-500" />,
          detalles: [
            "Realizar aplicación cada 15 días durante crecimiento vegetativo",
            "Evitar exceso de nitrógeno cerca de la cosecha",
            "Aplicar en horas frescas del día"
          ]
        });
        
        // Recomendación especial para lechuga
        if (cultivo.nombre.toLowerCase().includes('lechuga')) {
          nuevasRecomendaciones.push({
            tipo: 'manejo',
            titulo: "Cosecha de lechuga",
            mensaje: "La lechuga está cerca de su punto óptimo de cosecha",
            severidad: 'info',
            accion: "Cosechar en las primeras horas de la mañana para mantener frescura",
            icon: <Scissors className="text-gray-600" />,
            detalles: [
              `Días desde siembra: ${cultivo.dias_siembra}`,
              "Cosechar cuando las cabezas estén firmes pero antes de que se espiguen",
              "Mantener 2-3 hojas externas para protección durante transporte"
            ]
          });
        }
      }
      
      // Para frutas y hortalizas de fruto
      if (cultivoInfo.categoria === 'Frutas y Hortalizas de Fruto') {
        nuevasRecomendaciones.push({
          tipo: 'nutricion',
          titulo: "Fertilización balanceada",
          mensaje: "Requieren equilibrio entre nitrógeno, fósforo y potasio",
          severidad: 'info',
          accion: "Aplicar fertilizante 15-15-15 a razón de 200g/m²",
          icon: <Zap className="text-yellow-500" />,
          detalles: [
            "Aumentar potasio durante floración y fructificación",
            "Reducir nitrógeno en etapa de maduración",
            "Aplicar micronutrientes (boro, calcio) para prevenir trastornos"
          ]
        });
        
        // Recomendación para tomate
        if (cultivo.nombre.toLowerCase().includes('tomate')) {
          nuevasRecomendaciones.push({
            tipo: 'manejo',
            titulo: "Poda de tomates",
            mensaje: "La poda mejora la calidad y tamaño de frutos",
            severidad: 'info',
            accion: "Realizar poda de chupones semanalmente",
            icon: <Scissors className="text-gray-600" />,
            detalles: [
              "Eliminar brotes laterales (chupones) que crecen entre el tallo principal y las hojas",
              "Mantener 1-2 tallos principales según variedad",
              "Deshojar parte inferior para mejorar aireación"
            ]
          });
        }
      }
    }
  

    setLoading(false);
    return nuevasRecomendaciones;
  }, [cultivo, datosActuales, cultivoInfo, calcularDeficitRiego]);

  // Determinar color según severidad
  const getColorSeveridad = (severidad: string) => {
    return severidad === 'urgente' ? 'danger' :
           severidad === 'advertencia' ? 'warning' : 'primary';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Generando recomendaciones...</span>
      </div>
    );
  }

  return (
    <Card
      className="rounded-xl shadow w-full max-w-xl flex flex-col justify-between mx-auto"
      style={{
        background: 'rgba(224, 242, 254, 0.35)',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 8px 0 rgba(16, 185, 129, 0.08)',
        border: '1px solid #bbf7d0',
        color: '#166534',
        fontWeight: 500,
        fontSize: 13,
        padding: 12,
      }}
    >
      <CardHeader className="px-4 py-2 bg-blue-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-blue-800">
            Recomendaciones para {cultivo?.nombre || 'tu Cultivo'}
          </h2>
        </div>
      </CardHeader>
      
      <CardBody className="p-0">
        {recomendaciones.length > 0 ? (
          <div className="space-y-4 p-3">
            {cultivoInfo && (
              <div className="mb-4 p-3 bg-white rounded-xl border border-green-200">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Días desde siembra:</span>
                    <span className="font-semibold">{cultivo.dias_siembra}</span>
                  </div>
                  {cultivoInfo.etapaActual && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Etapa:</span>
                      <Badge color="success" variant="flat">
                        Etapa {cultivoInfo.etapaActual.numero} ({cultivoInfo.etapaActual.duracion} días)
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Temperatura:</span>
                    <span className="font-semibold">{datosActuales.temperatura}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Humedad suelo:</span>
                    <Chip
                      color={
                        datosActuales.estado_humedad === 'bajo' ? 'danger' :
                        datosActuales.estado_humedad === 'alto' ? 'warning' : 'success'
                      }
                      variant="flat"
                    >
                      {datosActuales.humedad_suelo}%
                    </Chip>
                  </div>
                </div>
              </div>
            )}
            {/* Lista de recomendaciones */}
            {recomendaciones.map((rec, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  rec.severidad === 'urgente' ? 'border-red-200 bg-red-50' :
                  rec.severidad === 'advertencia' ? 'border-amber-200 bg-amber-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-base font-semibold ${
                          rec.severidad === 'urgente' ? 'text-red-800' :
                          rec.severidad === 'advertencia' ? 'text-amber-800' :
                          'text-blue-800'
                        }`}>
                          {rec.titulo}
                        </h3>
                        <Badge
                          size="sm"
                          color={getColorSeveridad(rec.severidad)}
                          variant="flat"
                        >
                          {rec.severidad === 'urgente' ? 'Urgente' :
                            rec.severidad === 'advertencia' ? 'Precaución' : 'Informativo'}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{rec.mensaje}</p>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-white rounded-lg border border-green-200">
                    <span className="text-sm font-bold text-green-700">Acción recomendada:</span>
                    <p className="text-sm font-medium mt-1 ml-2 text-gray-800">{rec.accion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto" />
            <h3 className="mt-3 text-base font-medium text-gray-700">
              No hay recomendaciones disponibles
            </h3>
            <p className="mt-1 text-gray-500 text-sm">
              Complete los datos del cultivo para obtener recomendaciones personalizadas
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}