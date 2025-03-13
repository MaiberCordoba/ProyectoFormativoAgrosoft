import { Link } from "react-router-dom";
import { Search, Bell, User, LogOut, Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void; // Definiendo el tipo correctamente
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="flex items-center justify-between bg-green-700 p-3 text-white">
      <div className="flex items-center gap-4">
        {/* Botón para ocultar/mostrar Sidebar */}
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-green-800">
          <Menu />
        </button>

        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-2 rounded-full text-black focus:outline-none"
        />
        <Search className="text-white cursor-pointer" />
      </div>
      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer" />
        <User className="cursor-pointer" />
        <Link to="/login" className="flex items-center gap-2 cursor-pointer hover:underline">
          <LogOut /> Cerrar sesión
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
