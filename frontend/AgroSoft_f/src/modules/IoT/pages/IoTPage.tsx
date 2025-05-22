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
import { Sprout } from "lucide-react";
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


type Lote = {
  id: number;
  nombre: string;
};

type Era = {
  id: number;
  nombre: string;
  fk_lote_id: number;
};

type Plantacion = {
  id: number;
  fechaSiembra: string;
  fk_Cultivo: {
    id: string;
    nombre: string;
  };
  fk_Era: {
    id: string;
    fk_lote:{
      id: string;
      nombre: string;
    }
  }
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
  const [kcValue, setKcValue] = useState<string>("");
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
  const [plantaciones, setPlantaciones] = useState<Plantacion[]>([]);
  const [selectedPlantacion, setSelectedPlantacion] = useState<number | string>("");
  const [, setErrorET] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
  // Obtener plantaciones
  fetch('http://127.0.0.1:8000/api/plantaciones/')
    .then(res => res.json())
    .then(data => setPlantaciones(data))
    .catch(error => console.error("Error cargando plantaciones:", error));

  // Mantener fetches de lotes y eras para los filtros
  fetch('http://127.0.0.1:8000/api/lote/')
    .then(res => res.json())
    .then(data => setLotes(data));

  fetch('http://127.0.0.1:8000/api/eras/')
    .then(res => res.json())
    .then(data => setEras(data));
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
  if (!selectedPlantacion) {
    setErrorET("Selecciona una plantación");
    addToast({
      title: "Error",
      description: "Debes seleccionar una plantación para calcular la evapotranspiración.",
      variant: "flat",
      color: "danger",
    });
    return;
  }

  try {
    const params = new URLSearchParams({
      plantacion_id: String(selectedPlantacion)
    });
    
    if (kcValue) params.append('kc', kcValue);

    const response = await fetch(`http://localhost:8000/api/evapotranspiracion/?${params}`);
    
    if (!response.ok) throw new Error("Error al calcular evapotranspiración");
    
    const data = await response.json();
    
    setEvapotranspiracion({
      ...data,
      fecha: data.fecha || new Date().toISOString()
    });
    
    setErrorET(null);
    setShowETForm(false);
    // setLastET removed because it is not defined or used elsewhere
    
  } catch (error) {
    setErrorET(error instanceof Error ? error.message : "Error al calcular");
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

      <br />
      <Modal isOpen={showETForm} onClose={() => setShowETForm(false)} size="lg">
  <ModalContent>
    <ModalHeader className="text-xl font-semibold text-green-800">
      Calcular Evapotranspiración
    </ModalHeader>
    <ModalBody>
      <div className="space-y-4">
        <Select
          label="Seleccionar Plantación"
          placeholder="Selecciona una plantación"
          selectedKeys={selectedPlantacion ? [String(selectedPlantacion)] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setSelectedPlantacion(selected);
          }}
          className="w-full"
>
  {plantaciones.map(plantacion => (
    <SelectItem key={String(plantacion.id)}>
      {`Cultivo ${plantacion.fk_Cultivo}, Lote ${plantacion.fk_Era} (${new Date(plantacion.fechaSiembra).toLocaleDateString()})`}
    </SelectItem>
  ))}

        </Select>

        <Input
          label="Coeficiente de Cultivo (Kc - Opcional)"
          placeholder="Dejar vacío para cálculo automático"
          type="number"
          min="0"
          step="0.01"
          value={kcValue}
          onChange={(e) => setKcValue(e.target.value)}
          description="Valor numérico que representa el coeficiente del cultivo"
          className="w-full"
        />
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="default" onClick={() => setShowETForm(false)}>
        Cancelar
      </Button>
      <Button 
        color="success" 
        onClick={calcularEvapotranspiracion}
        disabled={!selectedPlantacion}
      >
        Calcular
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

{evapotranspiracion && (
  <div className="col-span-full bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm mt-8">
    <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center text-white">
      Evapotranspiración Real (ETc)
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sprout className="text-green-700" size={22} style={{ color: "#11751f" }} />
            Detalles de la Plantación
            </h3>
          <p><strong>Cultivo:</strong> {evapotranspiracion.detalles.cultivo}</p>
          <p><strong>Lote:</strong> {evapotranspiracion.detalles.lote}</p>
          <p><strong>Fecha Siembra:</strong> {new Date(evapotranspiracion.detalles.fecha_siembra).toLocaleDateString()}</p>
          <p><strong>Días desde siembra:</strong> {evapotranspiracion.detalles.dias_siembra}</p>
        </div>

        <EvapotranspiracionCard
          etReal={evapotranspiracion.evapotranspiracion_mm_dia}
          kc={evapotranspiracion.kc}
          detalles={{
            temperatura: evapotranspiracion.sensor_data.temperatura,
            viento: evapotranspiracion.sensor_data.viento,
            iluminacion: evapotranspiracion.sensor_data.iluminacion,
            humedad_ambiente: evapotranspiracion.sensor_data.humedad
          }}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
           Histórico de Evapotranspiración (mm/día)
        </h3>

        <EvapotranspiracionChart 
          plantacionId={selectedPlantacion.toString()}
          nuevoDato={{
            fecha: new Date().toISOString(),
            et_mm_dia: evapotranspiracion.evapotranspiracion_mm_dia,
            kc: evapotranspiracion.kc,
            temperatura: evapotranspiracion.sensor_data.temperatura,
            humedad: evapotranspiracion.sensor_data.humedad,
            dias_desde_siembra: evapotranspiracion.detalles.dias_desde_siembra
          }}
          showAdditionalInfo={true}
        />
      </div>
    </div>
  </div>
)}

<br />

      <div className="col-span-full">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto px-4 mb-2">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center text-white">
            Promedio de sensores
          </h2>
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
          <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center text-white">
            Lista de sensores
          </h2>
          <SensorLista />
        </div>
      </div>
    </div>
  );
}