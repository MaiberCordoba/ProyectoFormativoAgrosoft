import { useState } from "react";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { useGetUsers } from "../hooks/useGetUsers";
import { useEditarUsers } from "../hooks/useEditarUsers";
import { useCrearUsers } from "../hooks/useCrearUsers";
import { useEliminarUsers } from "../hooks/useEliminarUsers";
import { User } from "../types";
import EditarUserModal from "./EditarUsersModal";
import EliminarUserModal from "./EliminarUsersModal";
import { Chip } from "@heroui/react";
import { CrearUsersModal } from "./CrearUsersModal";
import RegistroMasivoModal from "./registroMasivoModal";


export function UsersList() {
  const { data, isLoading, error } = useGetUsers();
  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    UsersEditada,
    handleEditar,
  } = useEditarUsers();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsers();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    UsersEliminada,
    handleEliminar,
  } = useEliminarUsers();

  // ✅ Estado para modal de registro masivo
  const [isRegistroMasivoOpen, setIsRegistroMasivoOpen] = useState(false);

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      identificacion: 0,
      nombre: "",
      apellidos: "",
      fechaNacimiento: "",
      telefono: "",
      correoElectronico: "",
      admin: false,
      estado: "",
    });
  };

  const columnas = [
    { name: "Identificacion", uid: "identificacion", sortable: true },
    { name: "FechaNacimiento", uid: "fechaNacimiento", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Apellidos", uid: "apellidos" },
    { name: "Email", uid: "correoElectronico" },
    { name: "Rol", uid: "admin" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: User, columnKey: React.Key) => {
    switch (columnKey) {
      case "identificacion":
        return <span>{item.identificacion}</span>;
      case "fechaNacimiento":
        return <span>{item.fechaNacimiento}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "apellidos":
        return <span>{item.apellidos}</span>;
      case "correoElectronico":
        return <span>{item.correoElectronico}</span>;
      case "admin":
        return <span>{item.admin ? "Administrador" : "Usuario"}</span>;
      case "estado":
        return (
          <Chip
            size="sm"
            className="capitalize"
            variant="dot"
            color={item.estado === "activo" ? "success" : "danger"}
          >
            {item.estado}
          </Chip>
        );
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof User])}</span>;
    }
  };

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar los usuarios</p>;

  return (
    <div className="p-4 space-y-4">
      {/* Botones de acción arriba de la tabla */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handleCrearNuevo}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Nuevo Usuario
        </button>

        <button
          onClick={() => setIsRegistroMasivoOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Registro Masivo
        </button>
      </div>

      {/* Tabla */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre o email"
        onRegistroMasivo={() =>setIsRegistroMasivoOpen(true)}
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        opcionesEstado={[
          { uid: "activo", nombre: "Activo" },
          { uid: "inactivo", nombre: "Inactivo" },
        ]}
      />

      {/* Modales */}
      {isEditModalOpen && UsersEditada && (
        <EditarUserModal user={UsersEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearUsersModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && UsersEliminada && (
        <EliminarUserModal
          user={UsersEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}

      {/* ✅ Modal de registro masivo */}
      <RegistroMasivoModal
        isOpen={isRegistroMasivoOpen}
        onClose={() => setIsRegistroMasivoOpen(false)}
      />
    </div>
  );
}
