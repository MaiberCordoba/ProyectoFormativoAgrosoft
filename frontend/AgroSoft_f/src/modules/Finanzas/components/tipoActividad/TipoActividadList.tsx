import { useGetTipoActividad } from "../../hooks/tipoActividad/useGetTiposActividad";
import { useEditarTipoActividad } from "../../hooks/tipoActividad/useEditarTiposActividad";
import { useCrearTipoActividad } from "../../hooks/tipoActividad/useCrearTiposActividad";
import { useEliminarTipoActividad } from "../../hooks/tipoActividad/useEliminarTiposActividad";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarTipoActividadModal from "./EditarTipoActividadModal";
import { CrearTipoActividadModal } from "./CrearTipoActividadModal";
import EliminarTipoActividadModal from "./EliminarTipoActividad";
import { TipoActividad } from "../../types";

export function TipoActividadList() {
  const { data, isLoading, error } = useGetTipoActividad();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    tipoActividadEditada,
    handleEditar,
  } = useEditarTipoActividad();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearTipoActividad();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    tipoActividadEliminada,
    handleEliminar,
  } = useEliminarTipoActividad();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "" });
  };

  // Columnas de la tabla
  const columnas = [
    { name: "Nombre", uid: "nombre" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Render de cada celda
  const renderCell = (item: TipoActividad, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof TipoActividad])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los tipos de actividad</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && tipoActividadEditada && (
        <EditarTipoActividadModal
          tipoActividad={tipoActividadEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearTipoActividadModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && tipoActividadEliminada && (
        <EliminarTipoActividadModal
          tipoActividad={tipoActividadEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
