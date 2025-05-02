import { Navigate, Route, Routes} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Providers from "./context/ToastProvider";

//import { UsersPage } from "./modules/Users/pages/userPage";
import Principal from "@/layouts/principal";
import { Inicio } from "./pages/Inicio";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Login from "@/pages/Login";

//Finanzas
import { TiposDesechos } from "./modules/Finanzas/pages/pageTiposDesechos";
import { Desechos } from "./modules/Finanzas/pages/pageDesechos";
import { Actividades } from "./modules/Finanzas/pages/pageActividades";
import { Cosechas } from "./modules/Finanzas/pages/pageCosechas";
import { Herramientas } from "./modules/Finanzas/pages/pageHerramientas";
import { UsosHerramientas } from "./modules/Finanzas/pages/pageUsosHerramientas";
//import { UsosProductos } from "./modules/Finanzas/pages/pageUsosProductos";
import { Ventas } from "./modules/Finanzas/pages/pageVentas";
//import { UnidadesMedida } from "./modules/Finanzas/pages/pageUnidadesMedida";
import { UnidadesTiempo } from "./modules/Finanzas/pages/pageUnidadesTiempo";
import { Insumos } from "./modules/Finanzas/pages/pageInsumos"
import { Salarios } from "./modules/Finanzas/pages/pageSalarios";
import { TiempoActividadControl } from "./modules/Finanzas/pages/pageTiempoActividadControl";
import { TipoActividad } from "./modules/Finanzas/pages/pageTiposActividad";


//Electronica
import IoTPage from "./modules/IoT/pages/IoTPage";
import SensorDetail from "./modules/IoT/pages/SensorDetail";
import { SensorFormPage } from "./modules/IoT/pages/FormularioSensor";

//trazabilidad
import { TiposEspecie } from "./modules/Trazabilidad/pages/tiposEspecies";
import { EspeciesList } from "./modules/Trazabilidad/pages/especies";
import { Semillero } from "./modules/Trazabilidad/pages/semilleros";
import { Plantaciones } from "./modules/Trazabilidad/pages/plantaciones";
import { CultivoList } from "./modules/Trazabilidad/pages/cultivos";
import { ErasList } from "./modules/Trazabilidad/pages/eras";
import { LotesList } from "./modules/Trazabilidad/pages/lotes";
import { VariedadList } from "./modules/Trazabilidad/components/variedad/VariedadList";

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
import SolicitarRecuperacion from "./modules/Users/components/recuperaciones/solicitarRecuperacion"
import ResetearContrasena from "./modules/Users/components/recuperaciones/resetearContrasena";


//testeo
import Testeo  from "./pages/testeo";
import Toast from "./components/Toast";
import ResumenFinancieroPage from "./modules/Finanzas/pages/pageResumenEconomico";
import { MapPage } from "./modules/Trazabilidad/pages/MapaPage";




const queryClient = new QueryClient();

function App() {
  const token = localStorage.getItem("token");

  return (
    <Providers>
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* login */}
        <Route path="login" element={<Login />} />
        <Route path="/forgot-password" element={<SolicitarRecuperacion />} />
        <Route path="/resetearContrasena" element={<ResetearContrasena />} />

        {/* si no hay token y ruta no existe redirige a home */}
        {!token && 
        <Route path="*" element={
          <>
            <Toast
              title ="Ruta no encontrada"
              description="La dirección a la que intentaste acceder no existe"
            />
            <Navigate to="/login" />
          </>
        }
        />}

        <Route element={<Principal />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Inicio />} />

            {/* Usuarios */}
            <Route path="/usuarios" element={<Usuarios />} />
            

            {/* Finanzas */}
            <Route path="/tipos-de-desechos" element={<TiposDesechos />} />
            <Route path="/desechos" element={<Desechos/>} />
            <Route path="/herramientas" element={<Herramientas/>}  />
            <Route path="/actividades" element={<Actividades/>}  />
            <Route path="/ventas" element={<Ventas/>}/>
            <Route path="/cosechas" element={<Cosechas/>} />
            <Route path="/usos-herramientas" element={<UsosHerramientas/>} />
            {/*<Route path="/unidades-medida" element={<UnidadesMedida/>} />*/}
            <Route path="/unidades-tiempo" element={<UnidadesTiempo/>} />

         {/*<Route path="/usos-productos" element={<UsosProductos/>} /> */}
            <Route path="/insumos" element={<Insumos/>}/> 
            <Route path="/salarios" element={<Salarios/>}/>
            <Route path="/TiempoActividadControl" element={<TiempoActividadControl/>}/>
            <Route path="/TiposActividad" element={<TipoActividad/>}/>
            <Route path="/resumen-finanzas" element={<ResumenFinancieroPage/>} />



            {/*Electronica */}
            <Route path="/iot" element={<IoTPage/>}/>
            <Route path="/sensores/registrar" element={<SensorFormPage />} />
            <Route path="/sensores/:id" element={<SensorDetail />} />

            {/*Trazabilidad*/}
            <Route path="/tipos-especie" element={<TiposEspecie />} />
            <Route path="/especies" element={<EspeciesList />} />
            <Route path="/semilleros" element={<Semillero />} />
            <Route path="/informacion-cultivos-sembrados" element={<Plantaciones/>} />
            <Route path="/cultivos" element={<CultivoList />} />
            <Route path="/eras" element={<ErasList />} />
            <Route path="/lotes" element={<LotesList />} />
            <Route path="/variedad" element={<VariedadList />} />
            <Route path="/mapa" element={<MapPage/>} />
            

            {/*Sanidad*/}
            <Route path="/tipos-de-afectaciones" element={<TipoAfecciones/>}></Route>
            <Route path="/afectaciones" element={<Afecciones />} />
            <Route path="/tipos-de-control" element={<TipoControl/>}></Route>
            <Route path="/productos-para-el-control" element={<ProductosControl/>}></Route>
            <Route path="/usos-de-productos-para-el-control" element={<UsoProductosControl/>}></Route>
            <Route path="/controles" element={<Controles/>}></Route>
            <Route path="/afectaciones-en-cultivos" element={<AfeccionesCultivo/>}></Route>

            {/*test*/}
            <Route path="/testeo" element={<Testeo/>}></Route>

            {/* si hay token y ruta no existe redirige a home */}
            <Route path="*" 
              element={
                <>
                  <Toast
                    title ="Ruta no encontrada"
                    description="La dirección a la que intentaste acceder no existe"
                 />
                  <Navigate to="/home" />
                </>
              } 
            />
          </Route>
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </Providers>
  );
}

export default App;
