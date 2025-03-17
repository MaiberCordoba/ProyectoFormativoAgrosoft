import { Link } from "react-router-dom";
import { Home, Users, Monitor, Calendar, MapPin, Leaf, DollarSign } from "lucide-react";

interface SidebarProps {
  isOpen: boolean; // Definimos el tipo de la prop
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
    className={`bg-white p-4 shadow-lg min-h-screen flex flex-col gap-3 transition-all duration-300 rounded-xl overflow-hidden ${
      isOpen ? "w-46" : "w-0 hidden"
    }`}
    >
      {/* Imagen del Logo */}
      {isOpen && (
        <div className="flex justify-center mb-2">
          <img src="/logoAgrosoft.png" alt="Logo" className="w-32" />
        </div>
      )}

      {/* Menú de navegación */}
      <nav className={`flex flex-col gap-2 ${isOpen ? "block" : "hidden"}`}>
        <Link to="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Home size={20} /> Home
        </Link>
        <Link to="/usuarios" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Users size={20} /> Usuarios
        </Link>
        <Link to="/iot" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Monitor size={20} /> IoT
        </Link>
        <Link to="/calendario" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Calendar size={20} /> Calendario
        </Link>
        <Link to="/mapa" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <MapPin size={20} /> Mapa
        </Link>
        <Link to="/cultivos" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Leaf size={20} /> Cultivos
        </Link>
        <Link to="/finanzas" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <DollarSign size={20} /> Finanzas
        </Link>
      </nav>

      {/* Imagen de SENA */}
      {isOpen && (
        <div className="mt-auto flex flex-col items-center">
          <img src="/sena.png" alt="SENA" className="w-16" />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
