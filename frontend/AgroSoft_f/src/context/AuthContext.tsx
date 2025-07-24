import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/modules/Users/types";
import apiClient from "@/api/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { websocketService } from "@/services/websocketService";

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
      } catch (error) {
        console.error("Error al obtener usuario:", error);
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
    // Evitar decisiones hasta que la consulta de usuario termine
    if (isLoading) {
      return;
    }

    if (window.location.pathname === "/login" || !token || !isTokenValid(token)) {
      console.log("Redirigiendo al login: no hay token o token inválido");
      setIsAuthenticated(false);
      if (token) logout();
      return;
    }

    if (!user) {
      console.log("No hay usuario, esperando consulta o ejecutando logout");
      setIsAuthenticated(false);
      logout();
      return;
    }

    const decoded = jwtDecode<JwtPayload>(token);
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/ws/user/${decoded.user_id}/`;
    websocketService.connect({
      url: wsUrl,
      onMessage: (data) => {
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
      },
      onClose: (event) => console.log(`WebSocket de usuario cerrado, código: ${event.code}`),
      onError: (event) => {
        console.error(`Error en WebSocket de usuario ${decoded.user_id}`, event);
        addToast({
          title: "Error de conexión",
          description: "No se pudo conectar al servidor de usuario. Intenta recargar la página.",
          color: "danger",
        });
      },
    });

    return () => {
      console.log(`Cerrando conexión WebSocket para ${wsUrl}`);
      websocketService.close(wsUrl);
    };
  }, [token, user, isLoading, isTokenValid, queryClient]);

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
    console.log("Ejecutando logout");
    localStorage.removeItem("token");
    setToken(null);
    queryClient.removeQueries({ queryKey: ["current-user"] });
    setIsAuthenticated(false);
    websocketService.close(`${import.meta.env.VITE_WEBSOCKET_URL}/ws/user/${user?.id}/`);
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }, [queryClient, user?.id]);

  const updateUser = (userData: User) => {
    queryClient.setQueryData(["current-user"], userData);
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
  };

  const refreshUser = async () => {
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