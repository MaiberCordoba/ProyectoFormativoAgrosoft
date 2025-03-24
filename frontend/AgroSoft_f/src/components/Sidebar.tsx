import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Users,
  Monitor,
  Calendar,
  MapPin,
  Leaf,
  DollarSign,
  Wrench,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Función para verificar si una ruta está activa
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`bg-white p-4 shadow-lg min-h-screen flex flex-col gap-3 transition-all duration-300 rounded-xl overflow-hidden ${
        isOpen ? "w-56" : "w-0 hidden"
      }`}
    >
      {isOpen && (
        <div className="flex justify-center mb-2">
          <img src="/logoAgrosoft.png" alt="Logo" className="w-32" />
        </div>
      )}

      <nav className={`flex flex-col gap-2 ${isOpen ? "block" : "hidden"}`}>
        <NavLink 
          to="/home" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <Home size={20} /> Home
        </NavLink>
        
        <NavLink 
          to="/usuarios" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <Users size={20} /> Usuarios
        </NavLink>
        
        <NavLink 
          to="/iot" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <Monitor size={20} /> IoT
        </NavLink>

        {/* Menús con Submenús */}
        {[
          {
            title: "Cultivos",
            icon: Leaf,
            submenus: ["Semilleros", "Cultivos", "Lotes", "Eras", "Especies", "Tipos Especie", "Plantaciones"],
          },
          {
            title: "Actividades",
            icon: Wrench,
            submenus: ["Actividades", "Usos herramientas", "Herramientas", "Usos productos"],
          },
          {
            title: "Finanzas",
            icon: DollarSign,
            submenus: ["Ventas", "Cosechas", "Desechos", "Tipos de desechos"],
          },
          {
            title: "Gestión Fitosanitaria",
            icon: ShieldCheck,
            submenus: ["Tipos de afectaciones", "Afectaciones", "Afectaciones en cultivos", "Controles", "Productos para el control"],
            className: "text-left",
          },
        ].map((menu) => (
          <div key={menu.title}>
            <button
              className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 focus:outline-none ${
                menu.className || ""
              } ${
                menu.submenus.some(sub => 
                  location.pathname.includes(sub.toLowerCase().replace(/\s+/g, "-"))
                ) ? "bg-gray-200 font-medium" : ""
              }`}
              onClick={() => toggleMenu(menu.title)}
            >
              <div className="flex items-center gap-3">
                <menu.icon size={20} /> {menu.title}
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  openMenu === menu.title ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openMenu === menu.title ? "max-h-40" : "max-h-0"
              }`}
            >
              {menu.submenus.map((submenu) => {
                const path = `/${submenu.toLowerCase().replace(/\s+/g, "-")}`;
                return (
                  <NavLink
                    key={submenu}
                    to={path}
                    className={({ isActive }) => 
                      `block pl-10 py-1 text-gray-800 hover:bg-gray-100 rounded-lg ${
                        isActive ? "bg-gray-200 font-medium" : ""
                      }`
                    }
                  >
                    {submenu}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Calendario y Mapa al final */}
        <NavLink 
          to="/calendario" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <Calendar size={20} /> Calendario
        </NavLink>
        <NavLink 
          to="/mapa" 
          className={({ isActive }) => 
            `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <MapPin size={20} /> Mapa
        </NavLink>
      </nav>

      {isOpen && (
        <div className="mt-auto flex flex-col items-center">
          <img src="/sena.png" alt="SENA" className="w-16" />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;