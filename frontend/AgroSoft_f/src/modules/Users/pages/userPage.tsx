import { UserList } from "../components/listarUsuarios";
import { Afecciones } from "@/modules/Sanidad/Pages/afecciones";

export function UsersPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Obtener el usuario guardado

  return (
    <div>
      <h1>Usuarios</h1>
      {user.admin ? <UserList /> : <Afecciones />}
    </div>
  );
}