import { Link } from "react-router-dom";
import { Home, Users, Monitor, Calendar, MapPin, Leaf, DollarSign, Menu } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`bg-white p-4 shadow-lg min-h-screen flex flex-col gap-3 transition-all duration-300 ${isOpen ? "w-56" : "w-0"} rounded-xl`}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200 self-end">
        <Menu />
      </button>
      <div className="flex justify-center mb-3">
        <img
          src="/logo.png"
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? "w-20" : "w-0 opacity-0"}`}
        />
      </div>
      <nav className="flex flex-col gap-2">
        <Link to="/home" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Home /> {isOpen && "Home"}
        </Link>
        <Link to="/usuarios" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Users /> {isOpen && "Usuarios"}
        </Link>
        <Link to="/iot" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Monitor /> {isOpen && "IoT"}
        </Link>
        <Link to="/calendario" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Calendar /> {isOpen && "Calendario"}
        </Link>
        <Link to="/mapa" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <MapPin /> {isOpen && "Mapa"}
        </Link>
        <Link to="/cultivos" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <Leaf /> {isOpen && "Cultivos"}
        </Link>
        <Link to="/finanzas" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200">
          <DollarSign /> {isOpen && "Finanzas"}
        </Link>
      </nav>
      <div className="mt-auto flex flex-col items-center">
        <img
          src="/sena-logo.png"
          alt="SENA"
          className={`transition-all duration-300 ${isOpen ? "w-16" : "w-0 opacity-0"}`}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
