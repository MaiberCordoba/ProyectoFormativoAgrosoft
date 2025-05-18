import { useNavigate } from "react-router-dom";
import { Search, Bell, User, LogOut, Menu, X } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
  toggleSidebar,
}) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between h-full px-4 md:px-6 text-white">
      {/* Lado izquierdo - Logos y menú móvil */}
      <div className="flex items-center gap-4">
        {/* Botón móvil solo en versión mobile */}
        <button
          className="p-2 rounded-full hover:bg-[#25a902] md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Logos */}
        <div className="flex items-center gap-3">
          <img src="/sena.png" alt="SENA" className="h-10" />
          <div className="h-8 w-px bg-white/30" />
          <img src="/logoAgrosoft.png" alt="Agrosoft" className="h-8" />
        </div>
      </div>

      {/* Lado derecho - Elementos de navegación */}
      <div className="flex items-center gap-4">
        {/* Barra de búsqueda desktop */}
        <div className="hidden md:flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5">
          <Search size={20} className="text-white/80" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none placeholder-white/80 text-sm w-40"
          />
        </div>

        {/* Iconos desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Bell size={20} className="cursor-pointer hover:text-gray-200" />
          <User size={20} className="cursor-pointer hover:text-gray-200" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-gray-200"
          >
            <LogOut size={18} />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden relative">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-full hover:bg-[#25a902]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <User size={24} />}
          </button>

          {isMobileMenuOpen && (
            <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-xl w-48">
              <div className="p-2 space-y-2">
                <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded">
                  <Bell size={18} /> Notificaciones
                </button>
                <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded">
                  <User size={18} /> Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-red-600"
                >
                  <LogOut size={18} /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
