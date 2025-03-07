import { useUsers } from '../hooks/useUsers';
import TableComponent from '@/components/Table';
import { User } from "@/modules/test/types";

export function UserList() {
    const { data: users, isLoading, error } = useUsers();
  
    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los usuarios</p>;
  
    if (!users || users.length === 0) return <p>No se encontraron usuarios.</p>;
  
    // Definir columnas con claves estrictamente de tipo keyof User
    const userColumns: { key: keyof User; label: string }[] = [
      { key: "id", label: "ID" },
      { key: "identificacion", label: "Identificación" },
      { key: "nombre", label: "Nombre" },
      { key: "apellidos", label: "Apellidos" },
      { key: "fechaNacimiento", label: "Fecha de Nacimiento" },
      { key: "telefono", label: "Teléfono" },
      { key: "correoElectronico", label: "Correo Electrónico" },
      { key: "admin", label: "Admin" },
    ];
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Lista de Usuarios</h1>
        <TableComponent<User> columns={userColumns} data={users} />
      </div>
    );
  }
