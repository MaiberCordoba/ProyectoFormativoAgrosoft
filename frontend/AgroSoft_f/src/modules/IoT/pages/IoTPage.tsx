import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, SelectItem, addToast, toast } from "@heroui/react";
import {
  WiStrongWind,
  WiThermometer,
  WiDayCloudy,
  WiRaindrop,
  WiHumidity,
  WiRain, 
} from "react-icons/wi";
import { BiTestTube } from "react-icons/bi";
import SensorCard from "../components/SensorCard";
import { SensorLista } from "../components/sensor/SensorListar";
import EvapotranspiracionCard from "../components/EvapotranspiracionCard";
import EvapotranspiracionChart from "../components/EvapotranspiracionChart";
import { useEvapotranspiracionHistorica } from "../hooks/useEvapotranspiracionHistorica";

// Define missing types
type SensorData = {
  tipo: string;
  valor: number;
  umbral_minimo: number | null;
  umbral_maximo: number | null;
  [key: string]: any;
};

const SENSOR_TYPES = [
  { key: "VIE", label: "Viento" },
  { key: "TEM", label: "Temperatura" },
  { key: "LUM", label: "Luz Solar" },
  { key: "HUM_T", label: "Humedad del Suelo" },
  { key: "HUM_A", label: "Humedad Ambiente" },
  { key: "LLUVIA", label: "Lluvia" },
  { key: "PH", label: "pH" },
];

const SENSOR_UNITS: Record<string, string> = {
  VIE: "km/h",
  TEM: "°C",
  LUM: "lux",
  HUM_T: "%",
  HUM_A: "%",
  LLUVIA: "mm",
  PH: "",
};

export default function IoTPages() {
  const navigate = useNavigate();
  const [loteId, setLoteId] = useState<number>(1);
  const [lotes, setLotes] = useState<Array<{ id: number; nombre: string }>>([]);
  const [eras, setEras] = useState<Array<{ id: number; nombre: string; fk_lote_id: number }>>([]);
  const [cultivoId, setCultivoId] = useState<number | string>("");
  const { data: etHistorica = [], isLoading: isLoadingHistoric } = useEvapotranspiracionHistorica(
    Number(cultivoId),
    loteId
  );

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/lote/')
      .then(res => res.json())
      .then(data => setLotes(data));
      
    fetch('http://127.0.0.1:8000/api/eras/')
      .then(res => res.json())
      .then(data => setEras(data));
  }, []);

  const [filters, setFilters] = useState({
    loteId: "",
    eraId: "",
    hours: "24"
  });

  const [sensorAverages, setSensorAverages] = useState<Record<string, {
    average: number;
    unit: string;
    min_threshold?: number;
    max_threshold?: number;
    count?: number;
  }>>({});

  const [loadingAverages, setLoadingAverages] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [cultivos, setCultivos] = useState<any[]>([]);
  const [evapotranspiracion, setEvapotranspiracion] = useState<null | {
    evapotranspiracion_mm_dia: number;
    kc: number;
    sensor_data: {
      temperatura: number;
      viento: number;
      iluminacion: number;
      humedad: number;
    };
  }>(null);
  const [errorET, setErrorET] = useState<string | null>(null);
  const [lastET, setLastET] = useState<{
    fecha: string;
    et_mm_dia: number;
    kc?: number;
    temperatura?: number;
    humedad?: number;
  } | null>(null);
  const [sensoresData, setSensoresData] = useState<Record<string, string>>({});

  const fetchSensorAverages = async () => {
    setLoadingAverages(true);
    try {
      const params = new URLSearchParams();
      if (filters.loteId) params.append('lote_id', filters.loteId);
      if (filters.eraId) params.append('era_id', filters.eraId);
      params.append('hours', filters.hours);

      const response = await fetch(`http://127.0.0.1:8000/api/sensor/averages/?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Error al obtener promedios");
      }
      
      const data = await response.json();
      
      const transformedData: Record<string, any> = {};
      Object.keys(data).forEach(key => {
        transformedData[key] = {
          ...data[key],
          unit: SENSOR_UNITS[key] || '',
          average: data[key].average || 0,
          min_threshold: data[key].min_threshold || null,
          max_threshold: data[key].max_threshold || null,
          count: data[key].count || 0
        };
      });
      
      setSensorAverages(transformedData);
    } catch (error) {
      console.error("Error al obtener promedios:", error);
      addToast({
        title: "Error",
        description: "No se pudieron cargar los promedios de los sensores",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setLoadingAverages(false);
    }
  };

  useEffect(() => {
    fetchSensorAverages();
  }, [filters.loteId, filters.eraId, filters.hours]);

  const calcularEvapotranspiracion = async () => {
    if (!cultivoId) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/evapotranspiracion/?cultivo_id=${cultivoId}&lote_id=${loteId}`
      );
      
      if (!response.ok) throw new Error("Error al obtener evapotranspiración");
      
      const data = await response.json();
      
      setEvapotranspiracion(data);
      setErrorET(null);
      
      const nuevoDato = {
        fecha: new Date().toISOString(),
        et_mm_dia: data.evapotranspiracion_mm_dia,
        kc: data.kc,
        temperatura: data.sensor_data.temperatura,
        humedad: data.sensor_data.humedad
      };
      
      setLastET(nuevoDato);
      
    } catch (error) {
      console.error("Error:", error);
      setErrorET("No se pudo calcular la evapotranspiración.");
      setEvapotranspiracion(null);
    }
  };

  useEffect(() => {
    calcularEvapotranspiracion();
  }, [cultivoId, loteId]);

  useEffect(() => {
    fetch("http://localhost:8000/api/cultivos")
      .then((res) => res.json())
      .then((data) => {
        setCultivos(data);
      })
      .catch((error) => {
        console.error("Error al obtener los cultivos:", error);
      });
  }, []);

  const checkForAlerts = (sensor: SensorData): boolean => {
    if (sensor.umbral_minimo !== null && sensor.umbral_maximo !== null) {
      return sensor.valor < sensor.umbral_minimo || sensor.valor > sensor.umbral_maximo;
    }
    return false;
  };

  const showAlertToast = (sensor: SensorData) => {
    const sensorType = SENSOR_TYPES.find(st => st.key === sensor.tipo);
    const sensorName = sensorType?.label || sensor.tipo;
    const unit = SENSOR_UNITS[sensor.tipo] || "";

    let message = "";
    if (sensor.valor < (sensor.umbral_minimo || 0)) {
      message = `${sensorName} por debajo del mínimo (${sensor.umbral_minimo}${unit}). Valor actual: ${sensor.valor}${unit}`;
    } else {
      message = `${sensorName} por encima del máximo (${sensor.umbral_maximo}${unit}). Valor actual: ${sensor.valor}${unit}`;
    }

    addToast({
      title: "🚨 Alerta de Sensor",
      description: message,
      variant: "flat",
      color: "danger",
      duration: 5000,
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/sensor/?limit=100`);
        if (!response.ok) throw new Error("Error al obtener sensores");
        const sensorsData: SensorData[] = await response.json();

        if (Array.isArray(sensorsData)) {
          sensorsData.forEach(sensor => {
            if (checkForAlerts(sensor)) {
              showAlertToast(sensor);
            }
          });
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    fetchInitialData();
    fetchSensorAverages();
  }, []);

  useEffect(() => {
    const sensorConnections = [
      { id: "viento", tipo: "VIE" },
      { id: "temperatura", tipo: "TEM" },
      { id: "luzSolar", tipo: "LUM" },
      { id: "humedad", tipo: "HUM_T" },
      { id: "humedadAmbiente", tipo: "HUM_A" },
      { id: "lluvia", tipo: "LLUVIA" },
    ];

    const websockets = new Map<string, WebSocket>();

    sensorConnections.forEach(({ id, tipo }) => {
      const url = `ws://localhost:8000/ws/sensor/${id}/`;
      const ws = new WebSocket(url);
      websockets.set(id, ws);

      ws.onmessage = (event) => {
        try {
          const data: SensorData = JSON.parse(event.data);
          const valor = parseFloat(data.valor.toString());

          setSensoresData((prevData) => ({
            ...prevData,
            [id]: isNaN(valor) ? "-" : valor.toFixed(2),
          }));

          if (checkForAlerts(data)) {
            showAlertToast(data);
          }
        } catch (error) {
          console.error(`Error en ${tipo}:`, error);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error en ${tipo}:`, error);
      };
    });

    return () => {
      websockets.forEach((ws) => ws.close());
    };
  }, []);

  const sensoresList = [
    {
      id: "viento",
      tipo: "VIE",
      title: "Viento",
      icon: <WiStrongWind size={32} style={{ color: "#5DADE2" }} />,
    },
    {
      id: "temperatura",
      tipo: "TEM",
      title: "Temperatura",
      icon: <WiThermometer size={32} style={{ color: "#E74C3C" }} />,
    },
    {
      id: "luzSolar",
      tipo: "LUM",
      title: "Luz Solar",
      icon: <WiDayCloudy size={32} style={{ color: "#F1C40F" }} />,
    },
    {
      id: "humedad",
      tipo: "HUM_T",
      title: "Humedad",
      icon: <WiRaindrop size={32} style={{ color: "#3498DB" }} />,
    },
    {
      id: "humedadAmbiente",
      tipo: "HUM_A",
      title: "H. Ambiente",
      icon: <WiHumidity size={32} style={{ color: "#76D7C4" }} />,
    },
    {
      id: "lluvia",
      tipo: "LLUVIA",
      title: "Lluvia",
      icon: <WiRain size={32} style={{ color: "#2980B9" }} />,
    },
    {
      id: "ph",
      tipo: "PH",
      title: "pH",
      icon: <BiTestTube size={28} style={{ color: "#8E44AD" }} />,
    },
  ];

  const sensoresFiltrados = sensoresList.filter((sensor) =>
    sensor.title.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 sm:gap-12 justify-center items-center w-full max-w-6xl mx-auto">
      <div className="flex gap-2 w-full max-w-md">
        <Select
          label="Cultivo a calcular evapotranspiracion"
          placeholder="Selecciona un cultivo"
          selectedKeys={cultivoId !== "" ? [String(cultivoId)] : []}
          onSelectionChange={(keys) => {
            const selectedCultivoId = Number(Array.from(keys)[0]);
            setCultivoId(selectedCultivoId);
          }}
        >
          {cultivos.length > 0 ? (
            cultivos.map((cultivo) => (
              <SelectItem key={String(cultivo.id)}>{`Cultivo ${cultivo.id}`}</SelectItem>
            ))
          ) : (
            <SelectItem isDisabled>
              {cultivos.length === 0
                ? "No hay cultivos disponibles"
                : "Cargando..."}
            </SelectItem>
          )}
        </Select>
      </div>

      <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex justify-center">
          {evapotranspiracion ? (
              <EvapotranspiracionCard
              etReal={evapotranspiracion.evapotranspiracion_mm_dia}
              kc={evapotranspiracion.kc}
              detalles={evapotranspiracion.sensor_data}
            />
          ) : errorET ? (
            <p className="text-red-500">{errorET}</p>
          ) : (
            <p className="text-gray-500">Calculando evapotranspiración...</p>
          )}
        </div>
        <br />
        {evapotranspiracion && (
          <div className="flex justify-center">
            <EvapotranspiracionChart nuevoDato={lastET} />
          </div>
        )}
      </div>

      <div className="col-span-full flex justify-center">
        <button
          onClick={calcularEvapotranspiracion}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Recalcular Evapotranspiración
        </button>
      </div>

      <div className="flex justify-between items-center w-full col-span-full mb-4">
        <h2 className="text-xl font-semibold text-gray-800 justify-center">Promedios de Sensores</h2>
        <Input
          className="w-1/4"
          placeholder="Buscar Sensor"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>
      
      <div className="col-span-full flex gap-4 w-full max-w-6xl mx-auto">
        <Select
          label="Filtrar por Lote"
          placeholder="Todos los lotes"
          selectedKeys={filters.loteId ? [filters.loteId] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setFilters(prev => ({...prev, loteId: selected || ""}));
          }}
        >
          {lotes.map(lote => (
            <SelectItem key={String(lote.id)}>
              {lote.nombre}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Filtrar por Era"
          placeholder="Todas las eras"
          selectedKeys={filters.eraId ? [filters.eraId] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setFilters(prev => ({...prev, eraId: selected || ""}));
          }}
        >
          {eras.map(era => (
            <SelectItem key={String(era.id)}>
              Era {era.id}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Período de tiempo (horas)"
          selectedKeys={[filters.hours]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setFilters(prev => ({...prev, hours: selected || "24"}));
          }}
        >
          <SelectItem key="1">Última hora</SelectItem>
          <SelectItem key="6">Últimas 6 horas</SelectItem>
          <SelectItem key="24">Últimas 24 horas</SelectItem>
          <SelectItem key="168">Última semana</SelectItem>
          <SelectItem key="720">Último mes</SelectItem>
          <SelectItem key="4320">Último año</SelectItem>
        </Select>
      </div>
      <br />
      
      <div className="grid grid-cols-3 flex flex-wrap gap-4 justify-center items-center w-full max-w-6xl mx-auto">
        {sensoresFiltrados.length > 0 ? (
          sensoresFiltrados.map((sensor) => {
            const averageData = sensorAverages[sensor.tipo] || {};
            const hasData = averageData.average !== undefined;
            const isAlert = averageData.min_threshold !== undefined && 
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
                    ? `Mín: ${averageData.min_threshold?.toFixed(2) || 'N/A'} | Máx: ${averageData.max_threshold?.toFixed(2) || 'N/A'}`
                    : "No hay datos"
                }
                alert={isAlert}
                onClick={() => navigate(`/sensores/${sensor.id}`)}
              />
            );
          })
        ) : (
          <p className="text-gray-500">No se encontraron sensores</p>
        )}
      </div>
      <br />
      <br />

      <div className="flex gap-6 col-span-full">
        <div className="w-full">
          <h2 className="flex justify-center col-span-full text-xl font-semibold text-gray-800 ">Lista de Sensores</h2>
          <SensorLista />
        </div>
      </div>
    </div>
  );
}