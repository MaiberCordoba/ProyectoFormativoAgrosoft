import { createContext, useState, useEffect } from 'react';
import { getUser } from '@/api/Auth'; // Suponiendo que getUser verifica el token y devuelve los datos del usuario

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Verificar si el token es válido
      getUser(token)
        .then((userData) => {
          setUser(userData); // Guardar datos del usuario si el token es válido
        })
        .catch(() => {
          logout(); // Si no es válido, cerrar sesión
        });
    }
  }, [token]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
