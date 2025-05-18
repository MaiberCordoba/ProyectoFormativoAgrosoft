import { useNavigate } from "react-router-dom";
import { Search, Bell, User, LogOut, Menu, X } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; // Importar el contexto de autenticación

interface NavbarProps {
  toggleSidebar: () => void;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, onMobileMenuToggle, isMobileMenuOpen }) => {
  const { logout } = useContext(AuthContext); // Obtenemos la función logout del contexto
  const navigate = useNavigate(); // Accedemos a la función navigate

  const handleLogout = () => {
    if (logout) {
      logout(); // Llamamos a la función logout del contexto
      navigate("/login"); // Redirigimos a la página de login después de hacer logout
    }
  };

  return (
    <nav className="flex flex-wrap items-center justify-between bg-sena-green p-2 text-white w-full sticky top-0 z-40 shadow-lg">

      <div className="flex items-center gap-2 flex-1 md:flex-none">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-[#25a902]"
        >
          <Menu />
        </button>

        <input
          type="text-sm"
          placeholder="Buscar..."
          className="px-8 py-1 rounded-full text-black focus:outline-none"
        />
        <Search className="text-white cursor-pointer" />
      </div>
     {/* Lado derecho */}
      <div className="flex items-center gap-3 text-sm">
        {/* Elementos desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Bell className="cursor-pointer" />
          <User className="cursor-pointer" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 cursor-pointer hover:underline"
          >
            <LogOut size={16} /> Cerrar sesión
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
