export interface SensorData {
  id?: number;  
  fk_lote_id?: number | null;
  fk_eras_id?: number | null;
  fecha: string;
  tipo: "TEM" | "LUM" | "HUM_A" | "VIE" | "HUM_T" | "PH";
  valor: number;
  umbral_minimo?: number | null;  
  umbral_maximo?: number | null;
}

export const SENSOR_TYPES = [
  { key: "TEM", label: "Temperatura" },
  { key: "LUM", label: "Iluminación" },
  { key: "HUM_A", label: "Humedad Ambiental" },
  { key: "VIE", label: "Velocidad del Viento" },
  { key: "HUM_T", label: "Humedad del Terreno" },
  { key: "PH", label: "Nivel de PH" },
];

export interface SensorConExtras extends SensorData {
  unidad: string;              
  alerta: boolean;              
}
