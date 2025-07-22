// hooks/useSocketNotificaciones.ts
import { useEffect, useRef, useState } from "react";
import { Notificacion } from "../types";
import { useAuth } from "@/hooks/UseAuth";

export const useSocketNotificaciones = (onNotificacion: (noti: Notificacion) => void) => {
  const { user, token } = useAuth();
  const userId = user?.id || null;
  const wsRef = useRef<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!userId || !token) return;

    const connectWebSocket = () => {
      const wsBaseUrl = import.meta.env.VITE_WEBSOCKET_URL_PROD || import.meta.env.VITE_WEBSOCKET_URL;
      wsRef.current = new WebSocket(`${wsBaseUrl}/ws/notifications/${userId}/?token=${token}`);

      wsRef.current.onopen = () => {
        setReconnectAttempts(0);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "notification") {
          onNotificacion(data.notification);
        }
      };

      wsRef.current.onclose = (event) => {
        wsRef.current = null;
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          setReconnectAttempts((prev) => prev + 1);
          setTimeout(connectWebSocket, 5000);
        }
      };

      wsRef.current.onerror = () => {
        wsRef.current = null;
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "Componente desmontado");
      }
      wsRef.current = null;
    };
  }, [userId, token, onNotificacion, reconnectAttempts]);
};