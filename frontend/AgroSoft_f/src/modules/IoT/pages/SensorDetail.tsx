import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, SelectItem, Chip } from "@heroui/react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from "recharts";

// types.ts
export interface SensorData {
  id?: number;
  fk_lote?: number | null;
  fk_eras?: number | null;
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

const SENSOR_COLORS: Record<string, string> = {
  TEM: "#8884d8",
  LUM: "#ffc658",
  HUM_A: "#82ca9d",
  VIE: "#ff8042",
  HUM_T: "#0088FE",
  PH: "#00C49F"
};

const SENSOR_UNITS: Record<string, string> = {
  TEM: "°C",
  LUM: "lux",
  HUM_A: "%",
  VIE: "km/h",
  HUM_T: "%",
  PH: "pH"
};

const LOTES_ONLY = ["TEM", "LUM", "HUM_A", "VIE"];
const ERAS_ONLY = ["HUM_T", "PH"];

function dict(sensorTypes: {key: string, label: string}[]): Map<string, string> {
  const map = new Map();
  sensorTypes.forEach(type => map.set(type.key, type.label));
  return map;
}

export default function AllSensorsDashboard() {
  const navigate = useNavigate();
  const [allSensorsData, setAllSensorsData] = useState<SensorConExtras[]>([]);
  const [realTimeData, setRealTimeData] = useState<SensorConExtras[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [selectedLotes, setSelectedLotes] = useState<number[]>([]);
  const [selectedEras, setSelectedEras] = useState<number[]>([]);
  const [availableLotes, setAvailableLotes] = useState<{id: number, nombre: string}[]>([]);
  const [availableEras, setAvailableEras] = useState<{id: number, nombre: string, fk_lote_id: number}[]>([]);
  const [showLotesSelect, setShowLotesSelect] = useState(true);
  const [showErasSelect, setShowErasSelect] = useState(true);

  useEffect(() => {
    if (selectedType === "") {
      setShowLotesSelect(true);
      setShowErasSelect(true);
      return;
    }

    const hasLoteSensors = LOTES_ONLY.includes(selectedType);
    const hasEraSensors = ERAS_ONLY.includes(selectedType);

    setShowLotesSelect(hasLoteSensors);
    setShowErasSelect(hasEraSensors);

    if (!hasLoteSensors) setSelectedLotes([]);
    if (!hasEraSensors) setSelectedEras([]);
  }, [selectedType]);

  const checkForAlerts = (sensor: SensorData): boolean => {
    if (sensor.umbral_minimo !== null && sensor.umbral_maximo !== null) {
      return sensor.valor < sensor.umbral_minimo || sensor.valor > sensor.umbral_maximo;
    }
    return false;
  };

  const getLocationName = (sensor: SensorConExtras): string => {
    if (sensor.fk_lote) {
      const lote = availableLotes.find(l => l.id === sensor.fk_lote);
      return lote ? `Lote ${lote.nombre}` : `Lote ID:${sensor.fk_lote}`;
    }
    if (sensor.fk_eras) {
      const era = availableEras.find(e => e.id === sensor.fk_eras);
      if (era) {
        const lote = availableLotes.find(l => l.id === era.fk_lote_id);
        return `Era ${era.id}${lote ? ` (Lote ${lote.nombre})` : ''}`;
      }
      return `Era ID:${sensor.fk_eras}`;
    }
    return "Sin ubicación";
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const sensorsResponse = await fetch("http://127.0.0.1:8000/api/sensor/?limit=100");
        if (!sensorsResponse.ok) throw new Error("Error al obtener sensores");
        const sensorsData: SensorData[] = await sensorsResponse.json();

        if (Array.isArray(sensorsData)) {
          const enrichedData = sensorsData.map(item => ({
            ...item,
            unidad: SENSOR_UNITS[item.tipo],
            alerta: checkForAlerts(item)
          }));
          setAllSensorsData(enrichedData);

          const [lotesResponse, erasResponse] = await Promise.all([
            fetch("http://127.0.0.1:8000/api/lote/"),
            fetch("http://127.0.0.1:8000/api/eras/")
          ]);

          if (!lotesResponse.ok || !erasResponse.ok) {
            throw new Error("Error al obtener datos de ubicación");
          }

          const lotesData = await lotesResponse.json();
          const erasData = await erasResponse.json();

          setAvailableLotes(lotesData);
          setAvailableEras(erasData.map((era: any) => ({
            id: era.id,
            nombre: era.nombre,
            fk_lote_id: era.fk_lote_id
          })));
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/sensor/all/");

    socket.onmessage = (event) => {
      try {
        const data: SensorData = JSON.parse(event.data);
        const enrichedData: SensorConExtras = {
          ...data,
          unidad: SENSOR_UNITS[data.tipo],
          alerta: checkForAlerts(data)
        };
        setRealTimeData(prev => [...prev, enrichedData]);
      } catch (error) {
        console.error("Error al procesar datos del WebSocket:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Error de WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const combinedData = useMemo(() => {
    return [...allSensorsData, ...realTimeData];
  }, [allSensorsData, realTimeData]);

  const filteredSensors = useMemo(() => {
    return combinedData.filter(sensor => {
      const typeMatch = !selectedType || sensor.tipo === selectedType;
      const sensorMatch = selectedSensors.length === 0 || 
        (sensor.id && selectedSensors.includes(sensor.id.toString()));
      const loteMatch = selectedLotes.length === 0 || 
        (sensor.fk_lote && selectedLotes.includes(sensor.fk_lote));
      const eraMatch = selectedEras.length === 0 || 
        (sensor.fk_eras && selectedEras.includes(sensor.fk_eras));

      return typeMatch && sensorMatch && (loteMatch || eraMatch);
    });
  }, [combinedData, selectedType, selectedSensors, selectedLotes, selectedEras]);

  const chartData = useMemo(() => {
    const groupedByTime: Record<string, Record<string, number>> = {};

    combinedData.forEach(sensor => {
      const timeKey = new Date(sensor.fecha).toLocaleTimeString();
      if (!groupedByTime[timeKey]) {
        groupedByTime[timeKey] = { timestamp: timeKey };
      }
      if (sensor.id) {
        groupedByTime[timeKey][`${sensor.id}_valor`] = sensor.valor;
      }
    });

    return Object.values(groupedByTime);
  }, [combinedData]);

  const linesToShow = useMemo(() => {
    return filteredSensors.map(sensor => ({
      id: sensor.id?.toString() ?? '',
      type: sensor.tipo,
      location: getLocationName(sensor),
      color: SENSOR_COLORS[sensor.tipo],
      unit: SENSOR_UNITS[sensor.tipo]
    }));
  }, [filteredSensors]);

  return (
    <div className="p-6">
      <Button 
        color="success" 
        variant="light" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        Regresar
      </Button>

      <h1 className="text-2xl font-bold text-center mb-6">
        Todos los Sensores
      </h1>

      <div className="bg-white p-6 shadow-md rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Sensor
          </label>
          <Select
            selectedKeys={selectedType ? [selectedType] : []}
            onSelectionChange={(keys) => {
              const newType = Array.from(keys)[0] as string;
              setSelectedType(newType);
              setSelectedSensors([]);
            }}
          >
            {SENSOR_TYPES.map(type => (
              <SelectItem key={type.key} value={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {selectedType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sensores {dict(SENSOR_TYPES).get(selectedType)}
            </label>
            <Select
              selectionMode="multiple"
              selectedKeys={selectedSensors}
              onSelectionChange={(keys) => setSelectedSensors(Array.from(keys) as string[])}
            >
              {combinedData
                .filter(sensor => sensor.tipo === selectedType)
                .map(sensor => (
                  <SelectItem 
                    key={sensor.id?.toString() ?? ''} 
                    value={sensor.id?.toString() ?? ''}
                  >
                    {`${dict(SENSOR_TYPES).get(sensor.tipo)} - ${getLocationName(sensor)}`}
                  </SelectItem>
                ))}
            </Select>
          </div>
        )}

        {showLotesSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lotes
            </label>
            <Select
              selectionMode="multiple"
              selectedKeys={selectedLotes.map(String)}
              onSelectionChange={(keys) => setSelectedLotes(Array.from(keys).map(Number))}
            >
              {availableLotes.map(lote => (
                <SelectItem key={String(lote.id)}>
                  {lote.nombre}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Datos de Sensores</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {linesToShow.map((line, index) => (
                <Chip 
                  key={index}
                  color="primary"
                  variant="dot"
                  style={{ backgroundColor: line.color }}
                >
                  {dict(SENSOR_TYPES).get(line.type)} - {line.location}
                </Chip>
              ))}
            </div>
            
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fill: '#6b7280' }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                  formatter={(value: number, name: string) => {
                    const sensorId = name.split('_')[0];
                    const sensor = linesToShow.find(s => s.id === sensorId);
                    return [`${value} ${sensor?.unit}`, `${dict(SENSOR_TYPES).get(sensor?.type ?? '')} - ${sensor?.location}`];
                  }}
                  labelFormatter={(label) => `Hora: ${label}`}
                />
                <Legend 
                  formatter={(value) => {
                    const sensorId = value.split('_')[0];
                    const sensor = linesToShow.find(s => s.id === sensorId);
                    return `${dict(SENSOR_TYPES).get(sensor?.type ?? '')} - ${sensor?.location}`;
                  }}
                />
                
                {linesToShow.map((sensor) => (
                  <Line
                    key={sensor.id}
                    type="monotone"
                    dataKey={`${sensor.id}_valor`}
                    name={`${sensor.id}_valor`}
                    stroke={sensor.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Alertas Recientes</h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredSensors
            .filter(sensor => sensor.alerta)
            .slice(0, 5)
            .map((sensor, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-lg bg-red-50 border-red-200 hover:bg-red-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">
                        {dict(SENSOR_TYPES).get(sensor.tipo)}
                      </span>
                      <Chip color="danger" size="sm">Alerta</Chip>
                    </div>
                    
                    <div className="mt-1">
                      <span className="text-gray-600 font-medium">
                        Ubicación: {getLocationName(sensor)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-red-600">
                      {sensor.valor} {sensor.unidad}
                    </span>
                    {sensor.umbral_minimo !== null && sensor.umbral_maximo !== null && (
                      <span className="text-sm text-gray-600">
                        Rango esperado: {sensor.umbral_minimo}-{sensor.umbral_maximo} {sensor.unidad}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Fecha:</span> {new Date(sensor.fecha).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">ID Sensor:</span> {sensor.id}
                  </div>
                </div>
              </div>
            ))}
            
          {filteredSensors.filter(sensor => sensor.alerta).length === 0 && (
            <div className="p-4 border rounded-lg bg-green-50 border-green-200 text-center">
              No hay alertas activas en los filtros seleccionados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}