import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";  // Importa Outlet

const Principal = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6">
          <Outlet />  {/* Aquí se renderizarán las rutas hijas */}
        </main>
      </div>
    </div>
  );
};

export default Principal;
