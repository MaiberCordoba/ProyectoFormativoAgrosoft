import { useNavigate } from "react-router-dom";
import { Search, Bell, User, LogOut, Menu } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; // Importar el contexto de autenticación

interface NavbarProps {
  toggleSidebar: () => void; // Definiendo el tipo correctamente
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { logout } = useContext(AuthContext); // Obtenemos la función logout del contexto
  const navigate = useNavigate(); // Accedemos a la función navigate

  const handleLogout = () => {
    if (logout) {
      logout(); // Llamamos a la función logout del contexto
      navigate("/login"); // Redirigimos a la página de login después de hacer logout
    }
  };

  return (
    <nav className="flex items-center justify-between bg-green-700 p-2 text-white w-full">
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
        
        {/* Aquí añadimos el botón de "Cerrar sesión" */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 cursor-pointer hover:underline"
        >
          <LogOut /> Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
