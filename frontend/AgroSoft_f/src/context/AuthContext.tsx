import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/modules/Users/types";
import apiClient from "@/api/apiClient";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

interface JwtPayload {
  exp: number;
  user_id: number;
  // Agrega aquí otras propiedades que necesites
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verifica si el token es válido (no expirado y formato correcto)
  const isTokenValid = useCallback((tokenString: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(tokenString);
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      
      // Verificar expiración
      if (decoded.exp < currentTime) {
        console.warn("Token expirado");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Token inválido:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        if (isTokenValid(token)) {
          // Si el token es válido, actualizamos el estado
          setIsAuthenticated(true);
          
          // Opcional: Si no tenemos datos de usuario, los obtenemos
          if (!user) {
            try {
              const response = await apiClient.get("/usuarios/me/");
              setUser(response.data);
              localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
              console.error("Error obteniendo datos de usuario:", error);
            }
          }
        } else {
          // Token inválido - hacemos logout
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
    
    // Verificar cada minuto para detectar tokens expirados
    const interval = setInterval(verifyToken, 60 * 1000);
    return () => clearInterval(interval);
  }, [token, isTokenValid, user]);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Redirigir a login
    window.location.href = "/login";
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated,
        login, 
        logout, 
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};