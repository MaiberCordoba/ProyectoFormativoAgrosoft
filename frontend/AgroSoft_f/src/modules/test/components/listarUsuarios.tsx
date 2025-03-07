import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import TableComponent from "@/components/Table";
import ModalComponent from "@/components/Modal";
import { User } from "@/modules/test/types";
import { Button } from "@heroui/react";

export function UserList() {
  const { data: users, isLoading, error } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los usuarios</p>;
  if (!users || users.length === 0) return <p>No se encontraron usuarios.</p>;

  // Definir columnas con claves estrictamente de tipo keyof User
  const userColumns: { key: keyof User | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "identificacion", label: "Identificación" },
    { key: "nombre", label: "Nombre" },
    { key: "apellidos", label: "Apellidos" },
    { key: "fechaNacimiento", label: "Fecha de Nacimiento" },
    { key: "telefono", label: "Teléfono" },
    { key: "correoElectronico", label: "Correo Electrónico" },
    { key: "admin", label: "Admin" },
    { key: "acciones", label: "Acciones" }, // Nueva columna para el botón
  ];

  // Función para abrir el modal con detalles del usuario
  const handleDetailsClick = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Usuarios</h1>
      <TableComponent<User>
        columns={userColumns}
        data={users}
        renderActions={(user) => (
          <Button color="primary" size="sm" onClick={() => handleDetailsClick(user)}>
            Detalles
          </Button>
        )}
      />

      {/* Modal para ver detalles del usuario */}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalles del Usuario"
        footerButtons={[
          { label: "Cerrar", color: "danger", onClick: () => setModalOpen(false) },
        ]}
      >
        {selectedUser && (
          <div>
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Identificación:</strong> {selectedUser.identificacion}</p>
            <p><strong>Nombre:</strong> {selectedUser.nombre} {selectedUser.apellidos}</p>
            <p><strong>Fecha de Nacimiento:</strong> {selectedUser.fechaNacimiento}</p>
            <p><strong>Teléfono:</strong> {selectedUser.telefono}</p>
            <p><strong>Correo Electrónico:</strong> {selectedUser.correoElectronico}</p>
            <p><strong>Admin:</strong> {selectedUser.admin ? "Sí" : "No"}</p>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
