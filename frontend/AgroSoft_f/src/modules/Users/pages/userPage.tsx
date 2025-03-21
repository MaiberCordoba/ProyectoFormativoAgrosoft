import { useState } from "react";
import { UserList } from "../components/listarUsuarios";
import { Afecciones } from "@/modules/Sanidad/Pages/afecciones";
import UserRegisterModal from "../components/userRegisterModal";
import { Button } from "@heroui/react";

export function UsersPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Obtener el usuario guardado


  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  return (
    <div>
      
      <h1>Usuarios</h1>
      {/* Botón para abrir el modal de registro, FUERA de la tabla */}
            <div className="flex justify-end mb-4">
              <Button color="success" onClick={() => setRegisterModalOpen(true)}>
                Registrar Usuario
              </Button>
            </div>

      {/* Modal para registrar usuarios (se abre con el botón de arriba) */}
      <UserRegisterModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} />
    
    
      {user.admin ? <UserList /> : <Afecciones />}
    </div>
  );
}