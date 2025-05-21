// hooks/useNotificaciones.ts
import { useEffect, useState } from "react";
import { Notificacion } from "../types";
import {
  getNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
} from "../api/notifications";
import { useAuth } from "@/hooks/UseAuth";
import { useSocketNotificaciones } from "./useSocketNotifications";

export const useNotificaciones = () => {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    if (!userId) {
      setNotificaciones([]);
      return;
    }

    getNotificaciones()
      .then(setNotificaciones)
      .catch((err) => console.error("Error al cargar notificaciones", err));
  }, [userId]);

  useSocketNotificaciones((noti: Notificacion) => {
    setNotificaciones((prev) => [noti, ...prev]);
  });

  const marcarLeida = async (id: number) => {
    try {
      await marcarComoLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error al marcar como leída", err);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      await marcarTodasComoLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error al marcar todas como leídas", err);
    }
  };

  return {
    notificaciones,
    marcarLeida,
    marcarTodasLeidas,
  };
};