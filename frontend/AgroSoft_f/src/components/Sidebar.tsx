import { Link } from "react-router-dom";
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

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
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
        <Link to="/home" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Home size={20} /> Home
        </Link>
        <Link to="/usuarios" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Users size={20} /> Usuarios
        </Link>
        <Link to="/iot" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Monitor size={20} /> IoT
        </Link>

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
            className: "text-left", // Asegura que no quede centrado
          },
        ].map((menu) => (
          <div key={menu.title}>
            <button
              className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 focus:outline-none ${
                menu.className || ""
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
              {menu.submenus.map((submenu) => (
                <Link
                  key={submenu}
                  to={`/${submenu.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block pl-10 py-1 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  {submenu}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Calendario y Mapa al final */}
        <Link to="/calendario" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Calendar size={20} /> Calendario
        </Link>
        <Link to="/mapa" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <MapPin size={20} /> Mapa
        </Link>
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
