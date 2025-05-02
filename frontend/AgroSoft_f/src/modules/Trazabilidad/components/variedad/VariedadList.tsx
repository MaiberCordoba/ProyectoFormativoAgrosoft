import { useGetVariedad } from "../../hooks/variedad/useGetVariedad";
import { useEditarVariedad } from "../../hooks/variedad/useEditarVariedad";
import { useCrearVariedad } from "../../hooks/variedad/useCrearVariedad";
import { useEliminarVariedad } from "../../hooks/variedad/useEliminarVariedad";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { CrearVariedadModal } from "./CrearVariedadModal";
import { EditarVariedadModal } from "./EditarVariedadModal";
import { EliminarVariedadModal } from "./EliminarVariedad";
import { Variedad } from "../../types";

export function VariedadList() {
  const { data: variedades, isLoading, error } = useGetVariedad();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    VariedadEditada,
    handleEditar,
  } = useEditarVariedad();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearVariedad();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    VariedadEliminada,
    handleEliminar,
  } = useEliminarVariedad();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "" });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Variedad, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
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
        return <span>{String(item[columnKey as keyof Variedad])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las variedades</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={variedades || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && VariedadEditada && (
        <EditarVariedadModal
          variedad={VariedadEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearVariedadModal
          onClose={closeCreateModal}
          onCreate={handleCrear}
        />
      )}

      {isDeleteModalOpen && VariedadEliminada && (
        <EliminarVariedadModal
          variedad={VariedadEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
