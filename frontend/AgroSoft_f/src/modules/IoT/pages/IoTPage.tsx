import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input} from "@heroui/react";
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

  useEffect(() => {
    const sensores = ["viento", "temperatura", "luzSolar", "humedad", "humedadAmbiente", "lluvia"];
    const websockets = new Map<string, WebSocket>();

    sensores.forEach((sensor) => {
      const url = `ws://localhost:8000/ws/sensor/${sensor}/`;
      const ws = new WebSocket(url);

      ws.onopen = () => console.log(`✅ Conectado al WebSocket de ${sensor}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setSensoresData((prevData) => ({
            ...prevData,
            [sensor]: data.valor || "-",
          }));
        } catch (error) {
          console.error(`❌ Error en ${sensor}:`, error);
        }
      };

      ws.onclose = () => console.warn(`⚠️ WebSocket cerrado en ${sensor}`);
      websockets.set(sensor, ws);
    });

    return () => {
      websockets.forEach((ws) => ws.close());
    };
  }, []);

  const sensoresList = [
    { id: "viento", title: "Viento", icon: <WiStrongWind size={32} /> },
    { id: "temperatura", title: "Temperatura", icon: <WiThermometer size={32} /> },
    { id: "luzSolar", title: "Luz Solar", icon: <WiDayCloudy size={32} /> },
    { id: "humedad", title: "Humedad", icon: <WiRaindrop size={32} /> },
    { id: "humedadAmbiente", title: "H. Ambiente", icon: <WiHumidity size={32} /> },
    { id: "lluvia", title: "Lluvia", icon: <WiRain size={32} /> },
  ];

  // 🔍 Filtrar sensores según la búsqueda
  const sensoresFiltrados = sensoresList.filter((sensor) =>
    sensor.title.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 justify-center items-center w-full max-w-6xl mx-auto">
<div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="Filtrar Sensores..."
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      <br /><br />
      <div className="grid grid-cols-3 gap-10 justify-center items-center w-full max-w-6xl mx-auto">
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
      <div>
      <SensorLista/>
      </div>

    </div>
  );
}
