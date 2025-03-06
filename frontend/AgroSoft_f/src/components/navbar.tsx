import { Link } from "react-router-dom";
import { Search, Bell, User, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-green-700 p-3 text-white">
      <div className="flex items-center gap-4">
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