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
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  isHovering?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isHovering,
  toggleSidebar,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const toggleMenu = (menu: string) => {
    if (!isOpen && toggleSidebar) {
      // Si el sidebar está cerrado
      toggleSidebar(); // Abrir el sidebar
      setTimeout(() => {
        setOpenMenu(menu); // Desplegar el submenú después de la animación
      }, 300); // Duración igual a la transición (300ms)
    } else {
      // Comportamiento normal cuando está abierto
      setOpenMenu(openMenu === menu ? null : menu);
    }
  };

  return (
    <aside
      className={`h-full bg-white shadow-lg flex flex-col transition-all duration-300 ${
        isOpen ? "w-48" : "w-20"
      }`}
    >
      {/* Botón de toggle */}
      {toggleSidebar && (
        <button
          onClick={toggleSidebar}
          className={`absolute -right-3 top-4 bg-white rounded-full p-1 shadow-lg border
            transition-opacity duration-200 ${isHovering ? "opacity-100" : "opacity-0"}
            hover:bg-gray-100 z-50`}
        >
          {isOpen ? (
            <ChevronLeft size={20} className="text-gray-600" />
          ) : (
            <ChevronRight size={20} className="text-gray-600" />
          )}
        </button>
      )}

      <nav className="flex-1 overflow-y-auto p-2">
        {/* Elementos principales */}
        {[
          { icon: Home, text: "Home", to: "/home" },
          { icon: Users, text: "Usuarios", to: "/usuarios" },
          { icon: Monitor, text: "IoT", to: "/iot" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 p-2 rounded-lg mb-1 text-sm
              hover:bg-gray-200 transition-colors
              ${isActive ? "bg-gray-200 font-medium" : ""}
              ${!isOpen ? "justify-center" : ""}
            `}
          >
            <item.icon size={20} />
            {isOpen && <span>{item.text}</span>}
          </NavLink>
        ))}

        {/* Menús con submenús */}
        {[
          {
            title: "Cultivos",
            icon: Leaf,
            submenus: [
              "Semilleros",
              "Cultivos",
              "Lotes",
              "Eras",
              "Especies",
              "Tipos Especie",
              "Informacion Cultivos Sembrados",
            ],
          },
          {
            title: "Actividades",
            icon: Wrench,
            submenus: [
              "Actividades",
              "Tipos Actividad",
              "Tiempo actividad control",
              "Unidades medida",
              "Unidades tiempo",
            ],
          },
          {
            title: "Finanzas",
            icon: DollarSign,
            submenus: [
              "Ventas",
              "Cosechas",
              "Desechos",
              "Tipos de desechos",
              "resumen finanzas",
              "Salarios",
            ],
          },
          {
            title: "Inventario",
            icon: ClipboardList,
            submenus: [
              "Insumos",
              "Herramientas",
              "Usos Herramientas",
              "Usos Insumos",
              "Movimientos Inventario",
            ],
          },
          {
            title: "Fitosanitario",
            icon: ShieldCheck,
            submenus: [
              "Tipos de afectaciones",
              "Afectaciones",
              "Afectaciones en cultivos",
              "tipos de control",
              "Controles",
              "Seguimiento de afectaciones",
            ],
          },
          // ... otros menús
        ].map((menu) => (
          <div key={menu.title}>
            <button
              className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-200 ${
                menu.submenus.some((sub) =>
                  location.pathname.includes(
                    sub.toLowerCase().replace(/\s+/g, "-")
                  )
                )
                  ? "bg-gray-200"
                  : ""
              } ${!isOpen ? "justify-center px-0" : "justify-between"}`}
              onClick={() => toggleMenu(menu.title)}
            >
              <div
                className={`flex items-center ${isOpen ? "gap-3" : "justify-center w-full"}`}
              >
                <menu.icon size={20} />
                {isOpen && <span className="text-sm">{menu.title}</span>}
              </div>
              {isOpen && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openMenu === menu.title ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </button>

            {isOpen && openMenu === menu.title && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openMenu === menu.title ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="scroll-custom max-h-[150px] overflow-y-auto">
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
            )}
          </div>
        ))}

        {/* Elementos finales */}
        <NavLink
          to="/calendario"
          className={({ isActive }) => `
            flex items-center p-2 rounded-lg hover:bg-gray-200
            ${isActive ? "bg-gray-200 font-medium" : ""}
            ${!isOpen ? "justify-center px-0" : "gap-3"}
          `}
        >
          <Calendar size={20} />
          {isOpen && <span className="text-sm">Calendario</span>}
        </NavLink>
        <NavLink
          to="/mapa"
          className={({ isActive }) => `
            flex items-center p-2 rounded-lg hover:bg-gray-200
            ${isActive ? "bg-gray-200 font-medium" : ""}
            ${!isOpen ? "justify-center px-0" : "gap-3"}
          `}
        >
          <MapPin size={20} />
          {isOpen && <span className="text-sm">Mapa</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
