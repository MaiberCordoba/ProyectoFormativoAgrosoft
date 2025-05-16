import { SensorData } from "../types/sensorTypes";

const SOCKET_URL = "ws://127.0.0.1:8000/ws/sensor/";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export const connectWebSocket = (
  onMessage: (data: WebSocketMessage) => void,
  onAlert?: (alert: WebSocketMessage) => void,
  onError?: (error: string) => void
) => {
  const socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => console.log("✅ WebSocket conectado");

  socket.onmessage = (event) => {
    try {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      switch(data.type) {
        case "sensor.alert":
          onAlert?.(data);
          break;
        case "error":
          onError?.(data.message);
          break;
        default:
          onMessage(data);
      }
    } catch (error) {
      console.error("❌ Error al parsear JSON:", error);
      onError?.("Error al procesar los datos del sensor");
    }
  };

  socket.onerror = (error) => {
    console.error("❌ Error en WebSocket:", error);
    onError?.("Error de conexión con el servidor");
  };

  socket.onclose = () => {
    console.warn("⚠️ WebSocket cerrado. Reconectando...");
    setTimeout(() => connectWebSocket(onMessage, onAlert, onError), 5000);
  };

  return {
    close: () => socket.close(),
    send: (data: any) => socket.send(JSON.stringify(data))
  };
};

export const fetchSensorHistory = async (params: {
  hours?: number;
  type?: string;
  lote_id?: number;
  era_id?: number;
  limit?: number;
}): Promise<SensorData[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.hours) queryParams.append('hours', params.hours.toString());
  if (params.type) queryParams.append('type', params.type);
  if (params.lote_id) queryParams.append('lote_id', params.lote_id.toString());
  if (params.era_id) queryParams.append('era_id', params.era_id.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const response = await fetch(`http://127.0.0.1:8000/api/sensor/history/?${queryParams}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener el historial de sensores");
  }

  return await response.json();
};