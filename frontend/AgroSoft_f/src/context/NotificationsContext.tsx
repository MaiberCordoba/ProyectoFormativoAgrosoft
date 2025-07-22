// context/NotificationsContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { Notificacion } from "@/modules/Notificaciones/types";
import { getNotificaciones, marcarComoLeida, marcarTodasComoLeidas } from "@/modules/Notificaciones/api/notifications";
import { useSocketNotificaciones } from "@/modules/Notificaciones/hooks/useSocketNotifications";

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
      return;
    }

    const fetchNotificaciones = async () => {
      try {
        const data = await getNotificaciones();
        setNotificaciones(data);
      } catch {
        // Manejar error silenciosamente
      }
    };

    fetchNotificaciones();
  }, [userId]);

  useSocketNotificaciones((noti: Notificacion) => {
    setNotificaciones((prev) => {
      if (prev.some((n) => n.id === noti.id)) return prev;
      return [noti, ...prev];
    });
  });

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