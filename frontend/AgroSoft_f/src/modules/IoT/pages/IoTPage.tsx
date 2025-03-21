import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, addToast } from "@heroui/react";
import {
  WiStrongWind,
  WiThermometer,
  WiDayCloudy,
  WiRaindrop,
  WiHumidity,
  WiRain,
} from "react-icons/wi";
import SensorCard from "../components/SensorCard";

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
  const [sensorExiste, setSensorExiste] = useState(true);

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

  const verificarSensor = async () => {
    if (!searchId) {
      addToast({
        title: "⚠️ Advertencia",
        description: "Ingresa un ID de sensor",
        color: "warning",
        variant: "solid",
        radius: "full",
        timeout: 2000,
      });
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/sensor/${searchId}`);
      if (!res.ok) throw new Error("Sensor no encontrado");
      setSensorExiste(true);
      navigate(`/sensores/${searchId}`);
    } catch {
      setSensorExiste(false);
      addToast({
        title: "Error",
        description: "No existe el sensor que buscas",
        color: "danger",
        variant: "solid",
        radius: "full",
        timeout: 20,
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="Buscar Sensor por ID"
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <Button color="primary" onClick={verificarSensor}>
          Buscar
        </Button>
      </div>
      {!sensorExiste && <p className="text-red-500"> El sensor no existe</p>}

      <br/><br/>
      <div className="flex flex-wrap gap-4 justify-center">
        {sensoresList.map((sensor) => (
          <SensorCard
            key={sensor.id}
            icon={sensor.icon}
            title={sensor.title}
            value={sensoresData[sensor.id] ?? "Cargando..."}
            onClick={() => navigate(`/sensores/${sensor.id}`)}
          />
        ))}
      </div>
      <br />
      <Button color="primary" variant="faded" onClick={() => navigate("/sensores/registrar")}>
        Registrar Nuevo Sensor
      </Button>
    </div>
  );
}
