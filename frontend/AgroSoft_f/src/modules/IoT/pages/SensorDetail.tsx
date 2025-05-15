import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, SelectItem, Chip } from "@heroui/react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer, ReferenceLine
} from "recharts";
import { SensorData, SENSOR_TYPES, SensorConExtras } from "../types/sensorTypes";

// Colores para cada tipo de sensor
const SENSOR_COLORS: Record<string, string> = {
  TEM: "#8884d8",
  LUM: "#ffc658",
  HUM_A: "#82ca9d",
  VIE: "#ff8042",
  HUM_T: "#0088FE",
  PH: "#00C49F"
};

// Unidades para cada sensor
const SENSOR_UNITS: Record<string, string> = {
  TEM: "°C",
  LUM: "lux",
  HUM_A: "%",
  VIE: "km/h",
  HUM_T: "%",
  PH: "pH"
};

// Función helper para convertir SENSOR_TYPES a diccionario
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLotes, setSelectedLotes] = useState<number[]>([]);
  const [selectedEras, setSelectedEras] = useState<number[]>([]);
  const [availableLotes, setAvailableLotes] = useState<{id: number, nombre: string}[]>([]);
  const [availableEras, setAvailableEras] = useState<{id: number, nombre: string, fk_lote_id: number}[]>([]);

  // Función para verificar alertas
  const checkForAlerts = (sensor: SensorData): boolean => {
    if (sensor.umbral_minimo !== null && sensor.umbral_maximo !== null) {
      return sensor.valor < sensor.umbral_minimo || sensor.valor > sensor.umbral_maximo;
    }
    return false;
  };

  // Función para generar prefijos únicos para cada sensor
  const getSensorPrefix = (sensor: SensorConExtras): string => {
    const locationId = sensor.fk_lote_id || sensor.fk_eras_id;
    return `${sensor.tipo}-${locationId}`;
  };

  // Función para obtener el nombre del lote/era
  const getLocationName = (sensor: SensorConExtras): string => {
    if (sensor.fk_lote_id) {
      const lote = availableLotes.find(l => l.id === sensor.fk_lote_id);
      return lote ? `Lote: ${lote.nombre}` : `Lote ${sensor.fk_lote_id}`;
    }
    if (sensor.fk_eras_id) {
      const era = availableEras.find(e => e.id === sensor.fk_eras_id);
      const loteName = era?.fk_lote_id ? ` (Lote ${era.fk_lote_id})` : '';
      return era ? `Era: ${era.nombre}${loteName}` : `Era ${sensor.fk_eras_id}`;
    }
    return "Ubicación desconocida";
  };

  // Cargar datos históricos de todos los sensores
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Obtener datos de sensores
        const sensorsResponse = await fetch(`http://127.0.0.1:8000/api/sensor/?limit=100`);
        if (!sensorsResponse.ok) throw new Error("Error al obtener sensores");
        const sensorsData: SensorData[] = await sensorsResponse.json();
        
        if (Array.isArray(sensorsData)) {
          const enrichedData = sensorsData.map(item => ({
            ...item,
            unidad: SENSOR_UNITS[item.tipo],
            alerta: checkForAlerts(item)
          }));
          setAllSensorsData(enrichedData);
          
          // Obtener datos de ubicación
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
        // Aquí podrías agregar un toast o alerta para informar al usuario
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // WebSocket para datos en tiempo real
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

  // Combinar datos históricos y en tiempo real
  const combinedData = useMemo(() => {
    return [...allSensorsData, ...realTimeData];
  }, [allSensorsData, realTimeData]);

  // Filtrar sensores según selección
  const filteredSensors = useMemo(() => {
    return combinedData.filter(sensor => {
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(sensor.tipo);
      const loteMatch = selectedLotes.length === 0 || 
        (sensor.fk_lote_id && selectedLotes.includes(sensor.fk_lote_id));
      const eraMatch = selectedEras.length === 0 || 
        (sensor.fk_eras_id && selectedEras.includes(sensor.fk_eras_id));
      
      return typeMatch && (loteMatch || eraMatch);
    });
  }, [combinedData, selectedTypes, selectedLotes, selectedEras]);

  // Agrupar datos para el gráfico
  const chartData = useMemo(() => {
    // Agrupar por timestamp
    const groupedByTime: Record<string, SensorConExtras[]> = {};
    
    combinedData.forEach(sensor => {
      const timeKey = new Date(sensor.fecha).toLocaleTimeString();
      if (!groupedByTime[timeKey]) {
        groupedByTime[timeKey] = [];
      }
      groupedByTime[timeKey].push(sensor);
    });
    
    // Convertir a formato para Recharts
    return Object.entries(groupedByTime).map(([timestamp, sensors]) => {
      const point: any = { timestamp };
      sensors.forEach(sensor => {
        const prefix = getSensorPrefix(sensor);
        point[`${prefix}_valor`] = sensor.valor;
        point[`${prefix}_alerta`] = sensor.alerta;
        point[`${prefix}_unidad`] = sensor.unidad;
      });
      return point;
    });
  }, [combinedData]);

  // Obtener líneas a mostrar basadas en los sensores filtrados
  const linesToShow = useMemo(() => {
    const uniqueSensors = new Map<string, {type: string, locationId?: number, color: string}>();
    
    filteredSensors.forEach(sensor => {
      const key = `${sensor.tipo}-${sensor.fk_lote_id || sensor.fk_eras_id}`;
      if (!uniqueSensors.has(key)) {
        uniqueSensors.set(key, {
          type: sensor.tipo,
          locationId: sensor.fk_lote_id || sensor.fk_eras_id,
          color: SENSOR_COLORS[sensor.tipo]
        });
      }
    });
    
    return Array.from(uniqueSensors.values());
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

      {/* Filtros con accesibilidad corregida */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label id="sensor-type-label" className="block text-sm font-medium text-gray-700 mb-2">
            Tipos de Sensor
          </label>
          <Select
            aria-labelledby="sensor-type-label"
            selectionMode="multiple"
            selectedKeys={selectedTypes}
            onSelectionChange={(keys) => setSelectedTypes(Array.from(keys) as string[])}
          >
            {SENSOR_TYPES.map(type => (
              <SelectItem key={type.key} >
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <label id="lotes-label" className="block text-sm font-medium text-gray-700 mb-2">
            Lotes
          </label>
          <Select
            aria-labelledby="lotes-label"
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

        <div>
          <label id="eras-label" className="block text-sm font-medium text-gray-700 mb-2">
            Eras
          </label>
          <Select
            aria-labelledby="eras-label"
            selectionMode="multiple"
            selectedKeys={selectedEras.map(String)}
            onSelectionChange={(keys) => setSelectedEras(Array.from(keys).map(Number))}
          >
            {availableEras.map(era => (
              <SelectItem key={String(era.id)}>
                {era.nombre} (Lote {era.fk_lote_id})
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      

      {/* Gráfica */}
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
                  {dict(SENSOR_TYPES).get(line.type, 'Desconocido')} {line.locationId ? `(${line.locationId})` : ''}
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
                    const prefix = name.split('_')[0];
                    const unit = SENSOR_UNITS[prefix.split('-')[0]] || '';
                    return [`${value} ${unit}`, dict(SENSOR_TYPES).get(prefix.split('-')[0], 'Desconocido')];
                  }}
                  labelFormatter={(label) => `Hora: ${label}`}
                />
                <Legend 
                  formatter={(value) => {
                    const prefix = value.split('_')[0];
                    const type = prefix.split('-')[0];
                    const location = prefix.split('-')[1];
                    return `${dict(SENSOR_TYPES).get(type, 'Desconocido')}${location ? ` (${location})` : ''}`;
                  }}
                />
                
                {linesToShow.map((line, index) => {
                  const prefix = `${line.type}-${line.locationId}`;
                  return (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={`${prefix}_valor`}
                      name={`${prefix}_valor`}
                      stroke={line.color}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: line.color, strokeWidth: 2 }}
                    />
                  );
                })}
                
                {/* Líneas de referencia para umbrales */}
                {filteredSensors
                  .filter(s => s.alerta && s.umbral_maximo !== null)
                  .map((sensor, index) => (
                    <ReferenceLine
                      key={`max-${index}`}
                      y={sensor.umbral_maximo}
                      stroke="red"
                      strokeDasharray="3 3"
                      ifOverflow="extendDomain"
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Tabla de alertas */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Alertas Recientes</h2>
        <div className="space-y-2">
          {filteredSensors
            .filter(sensor => sensor.alerta)
            .slice(0, 5)
            .map((sensor, index) => (
              <div key={index} className="p-4 border rounded-lg bg-red-50 border-red-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{dict(SENSOR_TYPES).get(sensor.tipo, 'Desconocido')}</span>
                    <span className="text-gray-600 ml-2">({getLocationName(sensor)})</span>
                  </div>
                  <Chip color="danger" size="sm">Alerta</Chip>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-bold">
                    {sensor.valor} {sensor.unidad}
                  </span>
                  {sensor.umbral_minimo !== null && sensor.umbral_maximo !== null && (
                    <span className="text-gray-600 ml-2">
                      (Umbral: {sensor.umbral_minimo}-{sensor.umbral_maximo} {sensor.unidad})
                    </span>
                  )}
                </div>
              
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(sensor.fecha).toLocaleString()}
                </div>
              
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}