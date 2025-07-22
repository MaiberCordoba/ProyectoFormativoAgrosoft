import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/modules/Users/types";
import apiClient from "@/api/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  refreshUser: () => Promise<void>;
}

interface JwtPayload {
  exp: number;
  user_id: number;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        return jwtDecode<JwtPayload>(storedToken).exp > Date.now() / 1000;
      } catch {
        return false;
      }
    }
    return false;
  });
  const wsRef = useRef<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const { data: user, isLoading, refetch: refetchUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      if (!token) return null;
      try {
        const response = await apiClient.get("/usuarios/me/");
        const userData = response.data;
        if (userData.estado === "inactivo") {
          logout();
          addToast({
            title: "Cuenta inactiva",
            description: "Tu cuenta está inactiva. Contacta al administrador.",
            color: "danger",
          });
          return null;
        }
        return userData;
      } catch {
        logout();
        return null;
      }
    },
    enabled: !!token,
    staleTime: Infinity,
  });

  const isTokenValid = useCallback((tokenString: string): boolean => {
    try {
      return jwtDecode<JwtPayload>(tokenString).exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/login" || !token || !isTokenValid(token)) {
      setIsAuthenticated(false);
      if (token) logout();
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const decoded = jwtDecode<JwtPayload>(token);
    const wsBaseUrl = import.meta.env.VITE_WEBSOCKET_URL_PROD || import.meta.env.VITE_WEBSOCKET_URL;
    wsRef.current = new WebSocket(`${wsBaseUrl}/ws/user/${decoded.user_id}/`);

    wsRef.current.onopen = () => {
      setReconnectAttempts(0);
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "user_data") {
        const updatedUser: User = {
          id: data.id,
          correoElectronico: data.email,
          estado: data.estado,
          rol: data.rol,
          telefono: data.telefono || "",
          nombre: data.nombre || user?.nombre || "",
          apellidos: data.apellidos || user?.apellidos || "",
          identificacion: data.identificacion || user?.identificacion || "",
        };
        queryClient.setQueryData(["current-user"], updatedUser);
        queryClient.invalidateQueries({ queryKey: ["current-user"] });

        if (data.estado === "inactivo") {
          logout();
          addToast({
            title: "Cuenta inactiva",
            description: "Tu cuenta está inactiva. Contacta al administrador.",
            color: "danger",
          });
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    wsRef.current.onclose = (event) => {
      wsRef.current = null;
      if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
        setReconnectAttempts((prev) => prev + 1);
        reconnect();
      } else if (reconnectAttempts >= maxReconnectAttempts) {
        addToast({
          title: "Error de conexión",
          description: "No se pudo conectar al servidor de notificaciones.",
          color: "danger",
        });
      }
    };

    wsRef.current.onerror = () => {
      wsRef.current = null;
    };

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "Componente desmontado");
      }
      wsRef.current = null;
    };
  }, [token, isTokenValid, queryClient, reconnectAttempts]);

  const reconnect = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) return;
    setTimeout(() => {
      if (token && isTokenValid(token)) {
        const decoded = jwtDecode<JwtPayload>(token);
        const wsBaseUrl = import.meta.env.VITE_WEBSOCKET_URL_PROD || import.meta.env.VITE_WEBSOCKET_URL;
        wsRef.current = new WebSocket(`${wsBaseUrl}/ws/user/${decoded.user_id}/`);
      }
    }, 5000);
  }, [token, isTokenValid, reconnectAttempts]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        setToken(event.newValue);
        if (!event.newValue || !isTokenValid(event.newValue)) {
          logout();
        } else {
          setIsAuthenticated(true);
          refetchUser();
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isTokenValid, refetchUser]);

  const login = (token: string, userData: User) => {
    if (userData.estado === "inactivo") {
      localStorage.removeItem("token");
      setToken(null);
      addToast({
        title: "Cuenta inactiva",
        description: "Tu cuenta está inactiva. Contacta al administrador.",
        color: "danger",
      });
      return;
    }
    localStorage.setItem("token", token);
    setToken(token);
    queryClient.setQueryData(["current-user"], userData);
    setIsAuthenticated(true);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    queryClient.removeQueries({ queryKey: ["current-user"] });
    setIsAuthenticated(false);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, "Logout");
    }
    wsRef.current = null;
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }, [queryClient]);

  const updateUser = (userData: User) => {
    queryClient.setQueryData(["current-user"], userData);
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
  };

  const refreshUser = async () => {
    console.log("Refrescando usuario con refetchUser");
    await refetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        role: user?.rol || null,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};