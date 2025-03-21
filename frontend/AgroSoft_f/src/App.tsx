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

//semillero
import SemilleroRegister from "./modules/Trazabilidad/pages/registrarSemillero";
import { SemilleroList } from "./modules/Trazabilidad/components/listarSemilleros";
import { SemilleroEdit } from "./modules/Trazabilidad/pages/semilleroEdit";
//cultivo
import { CultivoEdit } from "./modules/Trazabilidad/pages/cultivoEdit";
import CultivoRegister from "./modules/Trazabilidad/pages/registrarCultivo";
import { CultivoList } from "./modules/Trazabilidad/components/listarCultivos";

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
            <Route path="/crearSemilleros" element={<SemilleroRegister />}/>
            <Route path="/semilleros" element={<SemilleroList />}/>
            <Route path="/editarSemillero/:id" element={<SemilleroEdit />} />
            <Route path="/crearCultivos" element={<CultivoRegister />}/>
            <Route path="/Cultivos" element={<CultivoList />}/>
            <Route path="/editarCultivo/:id" element={<CultivoEdit />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
