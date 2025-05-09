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
  const location= useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <>
    <aside
       className={`bg-white p-2 shadow-lg min-h-screen flex flex-col gap-1 transition-all duration-300 overflow-y-auto max-h-[calc(100vh-100px)]  ${
        isOpen ? "w-48 rounded-r-3xl " : "w-0 hidden"
      }`}
    >
      {isOpen && (
        <div className=" flex justify-center items-center gap-2 mb-1  top-0 bg-white z-10 py-2">
          <img src="/sena.png" alt="Agrosoft Logo" className="w-14" />
          <div className="h-10 w-px bg-gray-300" />
          <img  src="/logoAgrosoft.png" alt="SENA Logo" className="w-20" />
      </div>
      )}

      <nav className={` flex flex-col gap-1 ${isOpen ? "block" : "hidden"} `}>
        <NavLink 
          to="/home" 
          className={({ isActive }) => 
            `flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-200 text-sm ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <Home size={18} /> Home
        </NavLink>
        
        <NavLink 
          to="/usuarios" 
          className={({ isActive }) => 
            `flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-200 text-sm ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <Users size={18} /> Usuarios
        </NavLink>
        
        <NavLink 
          to="/iot" 
          className={({ isActive }) => 
            `flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-200 text-sm ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <Monitor size={18} /> IoT
        </NavLink>

        {/* Menús con Submenús */}
        {[
          {
            title: "Cultivos",
            icon: Leaf,
            submenus: ["Semilleros", "Cultivos", "Lotes", "Eras", "Especies", "Tipos Especie","Informacion Cultivos Sembrados"],
          },
          {
            title: "Actividades",
            icon: Wrench,
            submenus: ["Actividades", "Usos herramientas", "Herramientas", "Usos productos"],
          },
          {
            title: "Finanzas",
            icon: DollarSign,
            submenus: ["Ventas", "Cosechas", "Desechos", "Tipos de desechos","resumen finanzas"],
          },
          {
            title: "Gestión Fitosanitaria",
            icon: ShieldCheck,
            submenus: ["Tipos de afectaciones", "Afectaciones", "Afectaciones en cultivos", "tipos de control", "Controles", "Seguimiento de afectaciones"],
            className: "text-left",
          },
        ].map((menu) => (
          <div key={menu.title}>
            <button
              className={`flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-gray-200 focus:outline-none text-sm ${
                menu.className || ""
              } ${
                menu.submenus.some(sub => 
                  location.pathname.includes(sub.toLowerCase().replace(/\s+/g, "-"))
                ) ? "bg-gray-200 font-medium" : ""
              }`}
              onClick={() => toggleMenu(menu.title)}
            >
              <div className="flex items-center gap-2">
                <menu.icon size={18} /> {menu.title}
              </div>
              <ChevronDown
                size={16}
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
              <div className="scroll-custom max-h-[150px] overflow-y-auto"> {/* Clase scroll-custom */}
    {menu.submenus.map((submenu) => {
      const path = `/${submenu.toLowerCase().replace(/\s+/g, "-")}`;
      return (
        <NavLink
          key={submenu}
          to={path}
          className={({ isActive }) => 
            `block pl-8 py-1 text-xs text-gray-800 hover:bg-gray-100 rounded-lg ${
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
          </div>
        ))}

        {/* Calendario y Mapa al final */}
        <NavLink 
          to="/calendario" 
          className={({ isActive }) => 
            `flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-200 text-sm ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <Calendar size={18} /> Calendario
        </NavLink>
        <NavLink 
          to="/mapa" 
          className={({ isActive }) => 
            `flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-200 text-sm ${
              isActive ? "bg-gray-200 font-medium" : ""
            }`
          }
        >
          <MapPin size={18} /> Mapa
        </NavLink>
      </nav>
      
    </aside>
    </>
  );
};

export default Sidebar;