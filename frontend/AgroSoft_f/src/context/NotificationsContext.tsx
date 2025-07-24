import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { Notificacion } from "@/modules/Notificaciones/types";
import { getNotificaciones, marcarComoLeida, marcarTodasComoLeidas } from "@/modules/Notificaciones/api/notifications";
import { websocketService } from "@/services/websocketService";

interface NotificationsContextType {
  notificaciones: Notificacion[];
  marcarLeida: (id: number) => Promise<void>;
  marcarTodasLeidas: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    if (!userId) {
      setNotificaciones([]);
      websocketService.close(`${import.meta.env.VITE_WEBSOCKET_URL}/ws/notifications/${userId}/`);
      return;
    }

    // Cargar notificaciones iniciales
    const fetchNotificaciones = async () => {
      try {
        const data = await getNotificaciones();
        setNotificaciones(data);
      } catch {
        // Manejar error silenciosamente
      }
    };

    fetchNotificaciones();

    // Configurar WebSocket
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/ws/notifications/${userId}/`;
    websocketService.connect({
      url: wsUrl,
      onMessage: (data) => {
        if (data.type === "notification") {
          const noti: Notificacion = data.notification;
          setNotificaciones((prev) => {
            if (prev.some((n) => n.id === noti.id)) return prev;
            return [noti, ...prev];
          });
        }
      },
      onClose: (event) => console.log(`WebSocket de notificaciones cerrado, código: ${event.code}`),
      onError: () => console.error("Error en WebSocket de notificaciones"),
    });

    return () => {
      websocketService.close(wsUrl);
    };
  }, [userId]);

  const marcarLeida = async (id: number) => {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await marcarComoLeida(id);
    } catch {
      try {
        const data = await getNotificaciones();
        setNotificaciones(data);
      } catch {
        // Manejar error silenciosamente
      }
    }
  };

  const marcarTodasLeidas = async () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await marcarTodasComoLeidas();
    } catch {
      try {
        const data = await getNotificaciones();
        setNotificaciones(data);
      } catch {
        // Manejar error silenciosamente
      }
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notificaciones, marcarLeida, marcarTodasLeidas }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotificationsContext debe usarse dentro de NotificationsProvider");
  }
  return context;
};