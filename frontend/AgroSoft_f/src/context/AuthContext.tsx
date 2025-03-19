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
    if (token && !user) {
      getUser(token)
        .then(setUser)
        .catch((error) => {
          if (error.response?.status === 403) {
            console.warn('Token inválido o expirado. No cerrando sesión automáticamente.');
          } else {
            logout(); // Solo cerrar sesión si es otro tipo de error
          }
        });
    }
  }, [token]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
