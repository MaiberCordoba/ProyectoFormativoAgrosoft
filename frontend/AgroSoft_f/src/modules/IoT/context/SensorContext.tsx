import { createContext, useContext, useState, useEffect } from "react";
import { connectWebSocket } from "../api/sensorService";
import { SensorData } from "../types/sensorTypes";

interface SensorContextType {
  data: SensorData[];
  alerts: string[];
  alert: string | null;
}

const defaultContext: SensorContextType = {
  data: [],
  alerts: [],
  alert: null,
};

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    let socket: WebSocket | null = null;

    const connect = () => {
      socket = connectWebSocket((newData) => {
        if (!newData || !newData.mensaje_sensor) return;

        setData((prevData) => [...prevData.slice(-9), newData]);

        if (newData.mensaje_sensor.alerta) {
          setAlerts((prevAlerts) => [...prevAlerts.slice(-9), newData.mensaje_sensor.alerta]);
        }
      });

      socket.onclose = () => {
        console.warn("WebSocket desconectado, intentando reconectar...");
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => socket?.close();
  }, []);

  return (
    <SensorContext.Provider value={{ data, alerts, alert: alerts[alerts.length - 1] || null }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensorContext = () => {
  const context = useContext(SensorContext);
  if (!context) {
    console.warn("useSensorContext se llamó fuera de SensorProvider. Retornando valores por defecto.");
    return defaultContext;
  }
  return context;
};