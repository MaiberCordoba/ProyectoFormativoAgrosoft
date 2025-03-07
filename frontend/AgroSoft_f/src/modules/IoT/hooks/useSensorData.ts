import { useState, useEffect } from "react";
import { connectWebSocket } from "../api/sensorService"; // Asegúrate de que la ruta sea correcta
import { SensorData } from "../types/sensorTypes"; // Asegúrate de que la ruta sea correcta

export const useSensorData = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [alert, setAlert] = useState<string | null>(null); // Estado para la alerta

  useEffect(() => {
    const socket = connectWebSocket((newData) => {
      setData((prevData) => [...prevData.slice(-9), newData]); // Mantiene solo los últimos 9 datos

      // Verifica si hay una alerta en los datos del sensor
      if (newData.mensaje_sensor.alerta) {
        setAlert(newData.mensaje_sensor.alerta); // Actualiza la alerta
      } else {
        setAlert(null); // Resetea la alerta si no hay
      }
    });

    return () => socket.close(); // Cierra el socket al desmontar el componente
  }, []);

  return { data, alert }; // Devuelve los datos y la alerta
};