import { Link } from "react-router-dom";
import { Search, Bell, User, LogOut, Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void; // Definiendo el tipo correctamente
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="flex items-center justify-between bg-green-700 p-2 text-white">
      <div className="flex items-center gap-4">
        {/* Botón para ocultar/mostrar Sidebar */}
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-green-800">
          <Menu />
        </button>

        <input
          type="text-sm"
          placeholder="Buscar..."
          className="px-8 py-1 rounded-full text-black focus:outline-none"
        />
        <Search className="text-white cursor-pointer" />
      </div>
      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />
        <User className="cursor-pointer" />
        <Link to="/login" className="flex items-center gap-1 cursor-pointer hover:underline">
          <LogOut /> Cerrar sesión
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
