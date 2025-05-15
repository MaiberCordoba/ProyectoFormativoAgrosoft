import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, SelectItem, addToast } from "@heroui/react";
import {
  WiStrongWind,
  WiThermometer,
  WiDayCloudy,
  WiRaindrop,
  WiHumidity,
  WiRain,
} from "react-icons/wi";
import SensorCard from "../components/SensorCard";
import { SensorLista } from "../components/sensor/SensorListar";
import EvapotranspiracionCard from "../components/EvapotranspiracionCard";
import EvapotranspiracionChart from "../components/EvapotranspiracionChart";
import { useEvapotranspiracionHistorica } from "../hooks/useEvapotranspiracionHistorica";
import { SensorData, SENSOR_TYPES, SENSOR_UNITS } from "../types/sensorTypes";

export default function IoTPages() {
  const navigate = useNavigate();
  const [loteId, setLoteId] = useState<number>(1);
  const [cultivoId, setCultivoId] = useState<number | string>("");
  const { data: etHistorica = [], isLoading: isLoadingHistoric } = useEvapotranspiracionHistorica(
    Number(cultivoId),
    loteId
  );

  const [sensoresData, setSensoresData] = useState<Record<string, string>>({
    viento: "Cargando...",
    temperatura: "Cargando...",
    luzSolar: "Cargando...",
    humedad: "Cargando...",
    humedadAmbiente: "Cargando...",
    lluvia: "Cargando...",
  });

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

  // Función para verificar alertas
  const checkForAlerts = (sensor: SensorData): boolean => {
    if (sensor.umbral_minimo !== null && sensor.umbral_maximo !== null) {
      return sensor.valor < sensor.umbral_minimo || sensor.valor > sensor.umbral_maximo;
    }
    return false;
  };

  // Función para mostrar alertas
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
  }, []);

  // WebSocket para datos en tiempo real con verificación de alertas
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

          // Verificar alertas en datos en tiempo real
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
      
      // Crear nuevo dato para el historial
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

  // Calcular automáticamente al cambiar cultivo o lote
  useEffect(() => {
    calcularEvapotranspiracion();
  }, [cultivoId, loteId]);

  // Cargar cultivos al inicio
  useEffect(() => {
    fetch("http://localhost:8000/api/cultivos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Cultivos obtenidos:", data);
        setCultivos(data);
      })
      .catch((error) => {
        console.error("Error al obtener los cultivos:", error);
      });
  }, []);

  const sensoresList = [
    {
      id: "viento",
      title: "Viento",
      icon: <WiStrongWind size={32} style={{ color: "#5DADE2" }} />,
    },
    {
      id: "temperatura",
      title: "Temperatura",
      icon: <WiThermometer size={32} style={{ color: "#E74C3C" }} />,
    },
    {
      id: "luzSolar",
      title: "Luz Solar",
      icon: <WiDayCloudy size={32} style={{ color: "#F1C40F" }} />,
    },
    {
      id: "humedad",
      title: "Humedad",
      icon: <WiRaindrop size={32} style={{ color: "#3498DB" }} />,
    },
    {
      id: "humedadAmbiente",
      title: "H. Ambiente",
      icon: <WiHumidity size={32} style={{ color: "#76D7C4" }} />,
    },
    {
      id: "lluvia",
      title: "Lluvia",
      icon: <WiRain size={32} style={{ color: "#2980B9" }} />,
    },
  ];
  
  const sensoresFiltrados = sensoresList.filter((sensor) =>
    sensor.title.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 sm:gap-12 justify-center items-center w-full max-w-6xl mx-auto">

      {/* Selector de cultivo */}
      <div className="flex gap-2 w-full max-w-md">
        <Select
          label="Cultivo a calcular evapotranspiración"
          placeholder="Selecciona un cultivo"
          selectedKeys={cultivoId !== "" ? [String(cultivoId)] : []}
          onSelectionChange={(keys) => {
            const selectedCultivoId = Number(Array.from(keys)[0]);
            setCultivoId(selectedCultivoId);
          }}
        >
          {cultivos.length > 0 ? (
            cultivos.map((cultivo) => (
              <SelectItem key={String(cultivo.id)}>cultivo {cultivo.id}</SelectItem>
            ))
          ) : (
            <SelectItem isDisabled value="null">
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
        <h2 className="text-xl font-semibold text-gray-800 justify-center">Sensores Actuales</h2>
        <Input
          className="w-1/4"
          placeholder="Buscar Sensor"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-3 flex flex-wrap gap-4 justify-center items-center w-full max-w-6xl mx-auto">
        {sensoresFiltrados.length > 0 ? (
          sensoresFiltrados.map((sensor) => (
            <SensorCard
              key={sensor.id}
              icon={sensor.icon}
              title={sensor.title}
              value={sensoresData[sensor.id] ?? "Cargando..."}
              onClick={() => navigate(`/sensores/${sensor.id}`)}
            />
          ))
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