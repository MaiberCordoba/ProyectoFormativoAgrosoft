import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
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
import { addToast } from "@heroui/toast";

type SensorData = {
  tipo: string;
  valor: number;
  umbral_minimo: number | null;
  umbral_maximo: number | null;
  [key: string]: any;
};

type Cultivo = {
  id: number;
  nombre: string;
  kc_inicial?: number;
  kc_medio?: number;
  kc_final?: number;
};

type Lote = {
  id: number;
  nombre: string;
};

type Era = {
  id: number;
  nombre: string;
  fk_lote_id: number;
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
  const [showETForm, setShowETForm] = useState(false);
  const [cultivoId, setCultivoId] = useState<number | string>("");
  const [loteId, setLoteId] = useState<number | string>("");
  const [eraId, setEraId] = useState<number | string>("");
  const [kcValue, setKcValue] = useState<string>("");
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [eras, setEras] = useState<Era[]>([]);
  const [filters, setFilters] = useState({
    loteId: "",
    eraId: "",
    hours: "24"
  });
  const [sensorAverages, setSensorAverages] = useState<Record<string, any>>({});
  const [loadingAverages, setLoadingAverages] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [evapotranspiracion, setEvapotranspiracion] = useState<any>(null);
  const [errorET, setErrorET] = useState<string | null>(null);
  const [lastET, setLastET] = useState<any>(null);
  const [sensoresData, setSensoresData] = useState<Record<string, string>>({});

  // Cargar datos iniciales
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/cultivos/')
      .then(res => res.json())
      .then(data => setCultivos(data))
      .catch(error => console.error("Error cargando cultivos:", error));

    fetch('http://127.0.0.1:8000/api/lote/')
      .then(res => res.json())
      .then(data => setLotes(data))
      .catch(error => console.error("Error cargando lotes:", error));

    fetch('http://127.0.0.1:8000/api/eras/')
      .then(res => res.json())
      .then(data => setEras(data))
      .catch(error => console.error("Error cargando eras:", error));
  }, []);

  // Cargar promedios de sensores
  const fetchSensorAverages = async () => {
    setLoadingAverages(true);
    try {
      const params = new URLSearchParams();
      if (filters.loteId) params.append('lote_id', filters.loteId);
      if (filters.eraId) params.append('era_id', filters.eraId);
      params.append('hours', filters.hours);

      const response = await fetch(`http://127.0.0.1:8000/api/sensor/averages/?${params.toString()}`);
      if (!response.ok) throw new Error("Error al obtener promedios");
      
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

  // Calcular evapotranspiración
  const calcularEvapotranspiracion = async () => {
  if (!cultivoId || !loteId || !kcValue) {
    setErrorET("Completa todos los campos requeridos");
    return;
  }

  try {
    const kc = parseFloat(kcValue);
    if (isNaN(kc) || kc <= 0) {
      throw new Error("El valor Kc debe ser un número positivo");
    }

    let url = `http://localhost:8000/api/evapotranspiracion/?cultivo_id=${cultivoId}&lote_id=${loteId}&kc=${kc}`;
    if (eraId) url += `&era_id=${eraId}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al calcular evapotranspiración");
    
    const data = await response.json();
    if (!data || !data.sensor_data) {
      throw new Error("Datos incompletos recibidos del servidor");
    }
    
    setEvapotranspiracion(data);
    setErrorET(null);
    setShowETForm(false);
    
    setLastET({
      fecha: data.fecha || new Date().toISOString(),
      et_mm_dia: data.evapotranspiracion_mm_dia || 0,
      kc: data.kc || 0,
      temperatura: data.sensor_data.temperatura || 0,
      humedad: data.sensor_data.humedad || 0
    });
    
  } catch (error) {
    console.error("Error:", error);
    setErrorET(error instanceof Error ? error.message : "Error al calcular");
    setEvapotranspiracion(null);
  }
};

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
      title: "Alerta de Sensor",
      description: message,
      variant: "flat",
      color: "primary",

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

  // Configuración de WebSockets...
  const sensoresList = [
    { id: "viento", tipo: "VIE", title: "Viento", icon: <WiStrongWind size={32} style={{ color: "#5DADE2" }} /> },
    { id: "temperatura", tipo: "TEM", title: "Temperatura", icon: <WiThermometer size={32} style={{ color: "#E74C3C" }} /> },
    { id: "luzSolar", tipo: "LUM", title: "Luz Solar", icon: <WiDayCloudy size={32} style={{ color: "#F1C40F" }} /> },
    { id: "humedad", tipo: "HUM_T", title: "Humedad", icon: <WiRaindrop size={32} style={{ color: "#3498DB" }} /> },
    { id: "humedadAmbiente", tipo: "HUM_A", title: "H. Ambiente", icon: <WiHumidity size={32} style={{ color: "#76D7C4" }} /> },
    { id: "lluvia", tipo: "LLUVIA", title: "Lluvia", icon: <WiRain size={32} style={{ color: "#2980B9" }} /> },
    { id: "ph", tipo: "PH", title: "pH", icon: <BiTestTube size={28} style={{ color: "#8E44AD" }} /> },
  ];

  const sensoresFiltrados = sensoresList.filter((sensor) =>
    sensor.title.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 justify-center items-center w-full max-w-6xl mx-auto">
      <br />
      <div className="col-span-full flex justify-center">
        <Button 
          color="success" 
          onClick={() => setShowETForm(true)}
          className="px-6 py-3 text-lg"
        >
          Calcular Evapotranspiración
        </Button>
      </div>

      <Modal isOpen={showETForm} onClose={() => setShowETForm(false)} size="lg">
        <ModalContent>
          <ModalHeader className="text-xl font-semibold text-green-800">
            Calcular Evapotranspiración
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Seleccionar Cultivo"
                placeholder="Selecciona un cultivo"
                selectedKeys={cultivoId !== "" ? [String(cultivoId)] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setCultivoId(selected);
                }}
                className="w-full"
              >
                {cultivos.map(cultivo => (
                  <SelectItem key={String(cultivo.id)}>
                    {cultivo.nombre}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Seleccionar Lote"
                placeholder="Selecciona un lote"
                selectedKeys={loteId !== "" ? [String(loteId)] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setLoteId(selected);
                  setEraId("");
                }}
                className="w-full"
              >
                {lotes.map(lote => (
                  <SelectItem key={String(lote.id)}>
                    {lote.nombre}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Coeficiente de Cultivo (Kc)"
                placeholder="Ingresa el valor Kc"
                type="number"
                min="0"
                step="0.01"
                value={kcValue}
                onChange={(e) => setKcValue(e.target.value)}
                description="Valor numérico que representa el coeficiente del cultivo"
                className="w-full"
              />

              {errorET && (
                <div className="p-2 bg-red-50 text-red-600 rounded text-sm">
                  {errorET}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={() => setShowETForm(false)}>
              Cancelar
            </Button>
            <Button 
              color="success" 
              onClick={calcularEvapotranspiracion}
              disabled={!cultivoId || !loteId || !kcValue}
            >
              Calcular
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {evapotranspiracion && (
        <div className="col-span-full bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Resultados de Evapotranspiración
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <EvapotranspiracionCard
                etReal={evapotranspiracion.evapotranspiracion_mm_dia}
                kc={evapotranspiracion.kc}
                detalles={evapotranspiracion.sensor_data}
              />
            </div>
            <br />
            
            <div className="flex justify-center">
              <EvapotranspiracionChart 
                nuevoDato={lastET} 
                showAdditionalInfo={true}
              />
            </div>
          </div>
        </div>
      )}

      <div className="col-span-full">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto px-4 mb-2">
          <h2 className="text-lg font-semibold text-gray-800 text-white">Promedios de Sensores</h2>
          <Input
            className="w-1/4 text-sm h-8"
            placeholder="Buscar Sensor"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            size="sm"
          />
        </div>

        <div className="col-span-full flex gap-4 w-full max-w-6xl mx-auto px-4">
          <Select
            label="Filtrar por Lote"
            placeholder="Todos los lotes"
            selectedKeys={filters.loteId ? [filters.loteId] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setFilters(prev => ({...prev, loteId: selected || "", eraId: ""}));
            }}
            size="sm"
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
    size="sm"
  >
    {eras.map(era => (
      <SelectItem key={String(era.id)}>Era {era.id}</SelectItem>
    ))}
  </Select>

          <Select
            label="Período de tiempo (horas)"
            selectedKeys={[filters.hours]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setFilters(prev => ({...prev, hours: selected || "24"}));
            }}
            size="sm"
          >
            <SelectItem key="1">Última hora</SelectItem>
            <SelectItem key="6">Últimas 6 horas</SelectItem>
            <SelectItem key="24">Últimas 24 horas</SelectItem>
            <SelectItem key="168">Última semana</SelectItem>
            <SelectItem key="720">Último mes</SelectItem>
            <SelectItem key="4320">Último año</SelectItem>
          </Select>
        </div>

        <div className="grid grid-cols-3 flex flex-wrap gap-3 justify-center items-center w-full max-w-6xl mx-auto mt-4">
          {sensoresFiltrados.length > 0 ? (
            sensoresFiltrados.map((sensor) => {
              const averageData = sensorAverages[sensor.tipo] || {};
              const hasData = averageData.average !== undefined;
              const isAlert = averageData.min_threshold !== undefined && 
                           averageData.max_threshold !== undefined &&
                           (averageData.average < averageData.min_threshold || 
                            averageData.average > averageData.max_threshold);
              
              return (
                <div key={sensor.id} className="scale-90">
                  <SensorCard
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
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm col-span-full text-white">No se encontraron sensores</p>
          )}
        </div>
      </div>

      {/* Lista completa de sensores */}
      <div className="flex gap-4 col-span-full mt-6">
        <div className="w-full">
          <h2 className="flex justify-center col-span-full text-lg font-semibold text-gray-800 text-white mb-4">
            Lista Completa de Sensores
          </h2>
          <SensorLista />
        </div>
      </div>
    </div>
  );
}