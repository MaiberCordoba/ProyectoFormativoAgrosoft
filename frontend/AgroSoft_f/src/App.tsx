import { Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

//import { UsersPage } from "./modules/Users/pages/userPage";
import Principal from "@/layouts/principal";
import { Inicio } from "./pages/Inicio";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Login from "@/pages/Login";
import UserRegister from "./modules/Users/pages/registrarUsuario";
import { useAuth } from '@/hooks/UseAuth'; // Usa el hook aquí

//Finanzas
import { Cosechas } from "./modules/Finanzas/pages/pageCosechas";
import { Actividades } from "./modules/Finanzas/pages/pageActividades";
import { Desechos } from "./modules/Finanzas/pages/pageDesechos";
import { Herramientas } from "./modules/Finanzas/pages/pageHerramientas";
import { Ventas } from "./modules/Finanzas/pages/pageVentas";
import RegistrarActividad from "./modules/Finanzas/components/registrarActividades";
import RegistrarCosecha from "./modules/Finanzas/components/registrarCosechas";
import RegistrarDesechos from "./modules/Finanzas/components/registrarDesechos";
import RegistrarHerramientas from "./modules/Finanzas/components/registrarHerramientas";
import RegistrarVentas from "./modules/Finanzas/components/registrarVentas";

import IoTPage from "./modules/IoT/pages/IoTPage";
import SensorDetail from "./modules/IoT/pages/SensorDetail";
import { SensorFormPage } from "./modules/IoT/pages/FormularioSensor";

//semillero
import SemilleroRegister from "./modules/Trazabilidad/pages/registrarSemillero";
import { SemilleroList } from "./modules/Trazabilidad/components/listarSemilleros";
import { SemilleroEdit } from "./modules/Trazabilidad/pages/semilleroEdit";
//cultivo
import { CultivoEdit } from "./modules/Trazabilidad/pages/cultivoEdit";
import CultivoRegister from "./modules/Trazabilidad/pages/registrarCultivo";
import { CultivoList } from "./modules/Trazabilidad/components/listarCultivos";

import Testeo  from "./pages/testeo";
import Providers from "./context/ToastProvider";

//sanidad
import { Afecciones } from "./modules/Sanidad/Pages/afecciones";
import { TipoAfecciones } from "./modules/Sanidad/Pages/tipoafecciones";
import { TipoControl } from "./modules/Sanidad/Pages/tipocontrol";
import { ProductosControl } from "./modules/Sanidad/Pages/productoscontrol";
import { UsoProductosControl } from "./modules/Sanidad/Pages/usoproductoscontrol";
import { Controles } from "./modules/Sanidad/Pages/controles";
import { AfeccionesCultivo } from "./modules/Sanidad/Pages/afeccionescultivo";
        
//usuarios
import { Usuarios } from "./modules/Users/pages/pageUsers";


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
    <Providers>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/registro" element={<UserRegister />} />
        <Route element={<Principal />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Inicio />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/afectaciones" element={<Afecciones />} />
            <Route path="/cosechas" element={<Cosechas />} />
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/registro-actividad" element={<RegistrarActividad />} />
            <Route path="/registro-desecho" element={<RegistrarDesechos />} />
            <Route path="/registro-cosecha" element={<RegistrarCosecha />} />
            <Route path="/registro-herramienta" element={<RegistrarHerramientas />} />
            <Route path="/registro-venta" element={<RegistrarVentas />} />
            <Route path="/iot" element={<IoTPage />} />
            <Route path="/sensores/registrar" element={<SensorFormPage />} />
            <Route path="/sensores/:id" element={<SensorDetail />} />
            <Route path="/crearSemilleros" element={<SemilleroRegister />}/>
            <Route path="/semilleros" element={<SemilleroList />}/>
            <Route path="/editarSemillero/:id" element={<SemilleroEdit />} />
            <Route path="/crearCultivos" element={<CultivoRegister />}/>
            <Route path="/Cultivos" element={<CultivoList />}/>
            <Route path="/editarCultivo/:id" element={<CultivoEdit />} />
            <Route path="/desechos" element={<Desechos />} />
            <Route path="/herramientas" element={<Herramientas />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/testeo" element={<Testeo/>}></Route>
            <Route path="/tipos-de-afectaciones" element={<TipoAfecciones/>}></Route>
            <Route path="/tipos-de-control" element={<TipoControl/>}></Route>
            <Route path="/productos-para-el-control" element={<ProductosControl/>}></Route>
            <Route path="/usos-de-productos-para-el-control" element={<UsoProductosControl/>}></Route>
            <Route path="/controles" element={<Controles/>}></Route>
            <Route path="/afectaciones-en-cultivos" element={<AfeccionesCultivo/>}></Route>
          </Route>
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </Providers>
  );
}

export default App;
