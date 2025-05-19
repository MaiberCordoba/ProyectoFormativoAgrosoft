import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="flex items-center justify-between h-full px-4 md:px-6 text-white bg-sena-green">
      {/* Lado izquierdo - Logos y menú móvil */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-[#25a902] md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-3">
          <img src="/logoSenaW.png" alt="SENA" className="h-10" />
          <div className="h-8 w-px bg-white/30" />
          <img src="/logoAgrosofWB.png" alt="Agrosoft" className="h-9" />
        </div>
      </div>

      {/* Lado derecho - Elementos de navegación */}
      <div className="flex items-center gap-4">
        {/* Versión desktop - Solo se muestra en pantallas grandes */}
        <div className="hidden md:flex items-center gap-4">
          <Bell size={25} className="cursor-pointer hover:text-gray-200" />

          {user?.nombre && (
            <div className="flex items-center gap-2">
              <span className="font-medium">{user.nombre}</span>
              <div className="w-8 h-8 rounded-full bg-white text-sena-green flex items-center justify-center font-semibold">
                {getInitials(user.nombre)}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-gray-200"
          >
            <LogOut size={25} />
          </button>
        </div>

        {/* Versión móvil - Solo se muestra en pantallas pequeñas */}
        <div className="md:hidden relative">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-full hover:bg-[#25a902]"
          >
            {user?.nombre ? (
              <div className="w-8 h-8 rounded-full bg-white text-sena-green flex items-center justify-center font-semibold">
                {getInitials(user.nombre)}
              </div>
            ) : (
              <User size={24} />
            )}
          </button>

          {isMobileMenuOpen && (
            <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-xl w-48 z-50">
              {user?.nombre && (
                <div className="px-3 py-2 font-medium border-b">
                  {user.nombre}
                </div>
              )}
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
