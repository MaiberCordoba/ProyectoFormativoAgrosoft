export interface SensorData {
  sensor_id: number;
  tipo: string;
  valor: number;
  timestamp: string;
}

export const SENSOR_TYPES = [
  { key: "TEM", label: "Temperatura" },
  { key: "LUM", label: "Iluminación" },
  { key: "HUM_A", label: "Humedad Ambiental" },
  { key: "VIE", label: "Velocidad del Viento" },
  { key: "HUM_T", label: "Humedad del Terreno" },
  { key: "PH", label: "Nivel de PH" },
];

