import { useEffect } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { Notificacion } from "../types";
import { websocketService } from "@/services/websocketService";

export const useSocketNotificaciones = (onNotification: (noti: Notificacion) => void) => {
  const { user } = useAuth();
  const userId = user?.id || null;

  useEffect(() => {
    if (!userId) return;

    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/ws/notifications/${userId}/`;
    websocketService.connect({
      url: wsUrl,
      onMessage: (data) => {
        if (data.type === "notification") {
          onNotification(data.notification);
        }
      },
    });

    return () => {
      websocketService.close(wsUrl);
    };
  }, [userId, onNotification]);
};