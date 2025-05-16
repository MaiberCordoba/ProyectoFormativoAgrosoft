import { Card } from "@/components/ui/Card";
import MapComponent from "@/modules/Trazabilidad/components/mapa/Mapa";
import { WiThermometer, WiStrongWind } from "react-icons/wi";
import { useState, useEffect } from "react";
import SensorCard from "@/modules/IoT/components/SensorCard";

type SensorData = {
  tipo: string;
  valor: number;
  umbral_minimo: number | null;
  umbral_maximo: number | null;
  [key: string]: any;
};

const SENSOR_UNITS: Record<string, string> = {
  VIE: "km/h",
  TEM: "°C",
};

const sensoresToShow = [
  {
    id: "temperatura",
    tipo: "TEM",
    title: "Temperatura",
    icon: <WiThermometer size={32} style={{ color: "#E74C3C" }} />,
  },
  {
    id: "viento",
    tipo: "VIE",
    title: "Viento",
    icon: <WiStrongWind size={32} style={{ color: "#5DADE2" }} />,
  },
];

export function Inicio() {
  const [sensorAverages, setSensorAverages] = useState<Record<
    string,
    {
      average: number;
      unit: string;
      min_threshold?: number;
      max_threshold?: number;
      count?: number;
    }
  >>({});
  const [loadingAverages, setLoadingAverages] = useState(false);
  const loteId = 1; // Reemplaza con tu lógica para obtener el ID del lote

  const fetchSensorAverages = async () => {
    setLoadingAverages(true);
    try {
      const params = new URLSearchParams();
      params.append("lote_id", String(loteId));
      params.append("hours", "24"); // Puedes ajustar las horas

      const response = await fetch(
        `http://127.0.0.1:8000/api/sensor/averages/?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener promedios");
      }

      const data = await response.json();

      const transformedData: Record<string, any> = {};
      Object.keys(data).forEach((key) => {
        transformedData[key] = {
          ...data[key],
          unit: SENSOR_UNITS[key] || "",
          average: data[key].average || 0,
          min_threshold: data[key].min_threshold || null,
          max_threshold: data[key].max_threshold || null,
          count: data[key].count || 0,
        };
      });

      setSensorAverages(transformedData);
    } catch (error) {
      console.error("Error al obtener promedios:", error);
    } finally {
      setLoadingAverages(false);
    }
  };

  useEffect(() => {
    fetchSensorAverages();
  }, [loteId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Columna Izquierda: Cards de Sensores */}
      <Card className="h-full"> {/* Aseguramos que la card ocupe toda la altura */}
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Sensores</h3>
          <p className="text-sm text-gray-500">Datos en tiempo real</p>
        </div>
        <div className="p-4 grid gap-4">
          {sensoresToShow.map((sensor) => {
            const averageData = sensorAverages[sensor.tipo] || {};
            const hasData = averageData.average !== undefined;
            const isAlert =
              averageData.min_threshold !== undefined &&
              averageData.max_threshold !== undefined &&
              (averageData.average < averageData.min_threshold ||
                averageData.average > averageData.max_threshold);

            return (
              <SensorCard
                key={sensor.id}
                icon={sensor.icon}
                title={sensor.title}
                value={
                  loadingAverages
                    ? "Calculando..."
                    : hasData
                    ? `${averageData.average.toFixed(2)} ${averageData.unit}`
                    : "Sin datos"
                }
                subtitle={
                  hasData
                    ? `Mín: ${averageData.min_threshold?.toFixed(
                        2
                      ) || "N/A"} | Máx: ${
                        averageData.max_threshold?.toFixed(2) || "N/A"
                      }`
                    : "No hay datos"
                }
                alert={isAlert}
                // Puedes omitir el onClick si no necesitas navegación desde aquí
              />
            );
          })}
        </div>
      </Card>

      {/* Columna Derecha: Mapa Cuadrado */}
      <div className="aspect-square">
        <Card className="h-full"> {/* Aseguramos que la card ocupe toda la altura */}
          <div className="p-4 border-b">
            <h3 className="text-xl font-bold">Mapa de Cultivos</h3>
            <p className="text-sm text-gray-500">Visualización en tiempo real</p>
          </div>
          <div className="h-[calc(100%-80px)]">
            <MapComponent />
          </div>
        </Card>
      </div>
    </div>
  );
}