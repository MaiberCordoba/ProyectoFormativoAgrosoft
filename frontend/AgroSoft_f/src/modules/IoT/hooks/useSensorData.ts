import { useEffect, useState } from "react";
import { connectWebSocket } from "../api/sensorService"; // Se corrigió la ruta

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<any[]>([]); // Ahora es un array vacío
  const [alerta, setAlerta] = useState<string | null>(null);

  useEffect(() => {
    const socket = connectWebSocket((data) => {
      if (!data) return;
      
      console.log("📩 Datos recibidos del WebSocket:", data);

      setSensorData((prevData) => [...prevData.slice(-9), data]);
      setAlerta(data?.alerta ?? null);
    });

    return () => socket.close();
  }, []);

  return { data: sensorData, alerta };
};
