import { Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

import { UsersPage } from "./modules/Users/pages/userPage";
import Principal from "@/layouts/principal";
import { Inicio } from "./pages/Inicio";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Login from "@/pages/Login";
import UserRegister from "./modules/Users/pages/registrarUsuario";
import { useAuth } from '@/hooks/UseAuth'; // Usa el hook aquí
import { AfeccionesList } from "./modules/Sanidad/components/listAfecciones";
import { Cosechas } from "./modules/Finanzas/pages/pageCosechas";
import { Actividades } from "./modules/Finanzas/pages/pageActividades";
import RegistrarActividad from "./modules/Finanzas/components/registrarActividades";
import RegistrarCosecha from "./modules/Finanzas/components/registrarCosechas";

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const { token } = useAuth(); // Usamos el hook para acceder al token de AuthContext

  useEffect(() => {
    // No redirigir a login si estamos en la página de registro o recuperación de contraseña
    const path = window.location.pathname;
    if (!token && path !== '/forgot-password' && path !== '/registro') {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/registro" element={<UserRegister />} />
        <Route element={<Principal />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Inicio />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="/afectaciones" element={<AfeccionesList />} />
            <Route path="/cosechas" element={<Cosechas />} />
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/registro-actividad" element={<RegistrarActividad />} />
            <Route path="/registro-cosecha" element={<RegistrarCosecha />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
