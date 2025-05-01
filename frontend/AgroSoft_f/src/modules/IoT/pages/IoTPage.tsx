import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Select, SelectItem, addToast } from "@heroui/react";
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
import { UmbralLista } from "../components/umbral/UmbralListar";
import EvapotranspiracionCard from "../components/EvapotranspiracionCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Umbral } from "../types/sensorTypes"; 

export default function IoTPages() {
  const navigate = useNavigate();

  const [sensoresData, setSensoresData] = useState<Record<string, string>>({
    viento: "Cargando...",
    temperatura: "Cargando...",
    luzSolar: "Cargando...",
    humedad: "Cargando...",
    humedadAmbiente: "Cargando...",
    lluvia: "Cargando...",
  });

  const [searchId, setSearchId] = useState("");
  const [cultivoId, setCultivoId] = useState<number | string>("");
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

  const { data: umbrales = [] } = useQuery<Umbral[]>({
    queryKey: ["umbrales"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/umbral");
      return res.data;
    },
  });

  const normalizar = (str: string) => str.toLowerCase().replace(/\s/g, "");

  const mostrarAlerta = (mensaje: string) => {
    addToast({
      title: "🚨 Alerta de Sensor",
      description: mensaje,
      variant: "flat",
      color: "danger",
    });
  };

  useEffect(() => {
    const sensores = [
      { id: "viento", tipo_sensor: "VIE" },
      { id: "temperatura", tipo_sensor: "TEM" },
      { id: "luzSolar", tipo_sensor: "LUM" },
      { id: "humedad", tipo_sensor: "HUM_T" },
      { id: "humedadAmbiente", tipo_sensor: "HUM_A" },
      { id: "lluvia", tipo_sensor: "LLUVIA" },
    ];

    const websockets = new Map<string, WebSocket>();

    sensores.forEach(({ id, tipo_sensor }) => {
      const url = `ws://localhost:8000/ws/sensores/${id}/`;
      const ws = new WebSocket(url);
      websockets.set(id, ws);

      ws.onopen = () => console.log(`✅ Conectado al WebSocket de ${id}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const valor = parseFloat(data.valor);

          setSensoresData((prevData) => ({
            ...prevData,
            [id]: isNaN(valor) ? "-" : valor.toFixed(2),
          }));

          const umbral = umbrales.find(
            (u) =>
              u.tipo_sensor &&
              normalizar(u.tipo_sensor) === normalizar(tipo_sensor)
          );

          if (umbral && !isNaN(valor)) {
            if (valor < umbral.valor_minimo || valor > umbral.valor_maximo) {
              mostrarAlerta(
                `${id.toUpperCase()} fuera de umbral.\nValor actual: ${valor}\nRango permitido: ${umbral.valor_minimo} - ${umbral.valor_maximo}`
              );
            }
          }
        } catch (error) {
          console.error(`❌ Error en ${id}:`, error);
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ WebSocket error en ${id}:`, error);
      };

      ws.onclose = () => {
        console.warn(`⚠️ WebSocket cerrado en ${id}`);
      };
    });

    return () => {
      websockets.forEach((ws) => ws.close());
    };
  }, [umbrales]);

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

  useEffect(() => {
    if (!cultivoId) return;

    const lote_id = 1;
    fetch(
      `http://localhost:8000/api/evapotranspiracion/?cultivo_id=${cultivoId}&lote_id=${lote_id}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener evapotranspiración");
        return res.json();
      })
      .then((data) => {
        setEvapotranspiracion(data);
        setErrorET(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorET("No se pudo calcular la evapotranspiración.");
      });
  }, [cultivoId]);

  const sensoresList = [
    { id: "viento", title: "Viento", icon: <WiStrongWind size={32} /> },
    { id: "temperatura", title: "Temperatura", icon: <WiThermometer size={32} /> },
    { id: "luzSolar", title: "Luz Solar", icon: <WiDayCloudy size={32} /> },
    { id: "humedad", title: "Humedad", icon: <WiRaindrop size={32} /> },
    { id: "humedadAmbiente", title: "H. Ambiente", icon: <WiHumidity size={32} /> },
    { id: "lluvia", title: "Lluvia", icon: <WiRain size={32} /> },
  ];

  const sensoresFiltrados = sensoresList.filter((sensor) =>
    sensor.title.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 sm:gap-12 justify-center items-center w-full max-w-6xl mx-auto">

      <div className="flex gap-2 w-full max-w-md">
        <Select
          label="Cultivo a calcular evapotranspiración"
          placeholder="Selecciona un cultivo"
          selectedKeys={cultivoId !== "" ? [String(cultivoId)] : []}
          onSelectionChange={(keys) => {
            const selectedCultivoId = Number(Array.from(keys)[0]);
            console.log("Cultivo seleccionado:", selectedCultivoId);
            setCultivoId(selectedCultivoId);
          }}
        >
          {cultivos.length > 0 ? (
            cultivos.map((cultivo) => (
              <SelectItem key={String(cultivo.id)}>{cultivo.nombre}</SelectItem>
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

      <br />
      <div className="flex justify-center col-span-full">
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
      <div className="col-span-full">
        <SensorLista />
      </div>

      <br />
      <div className="col-span-full">
        <UmbralLista />
      </div>
    </div>
  );
}
