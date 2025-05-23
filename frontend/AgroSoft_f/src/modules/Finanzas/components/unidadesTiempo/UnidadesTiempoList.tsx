import { useGetUnidadesTiempo } from "../../hooks/unidadesTiempo/useGetUnidadesTiempo";
import { useEditarUnidadesTiempo } from "../../hooks/unidadesTiempo/useEditarUnidadesTiempo";
import { useCrearUnidadesTiempo } from "../../hooks/unidadesTiempo/useCrearUnidadesTiempo";
import { useEliminarUnidadesTiempo } from "../../hooks/unidadesTiempo/useEliminarUnidadesTiempo";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarUnidadesTiempoModal from "./EditarUnidadesTiempoModal";
import { CrearUnidadesTiempoModal } from "./CrearUnidadesTiempoModal";
import EliminarUnidadesTiempoModal from "./EliminarUnidadesTiempo";
import { UnidadesTiempo } from "../../types";

export function UnidadesTiempoList() {
  const { data, isLoading, error } = useGetUnidadesTiempo();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    unidadTiempoEditada,
    handleEditar,
  } = useEditarUnidadesTiempo();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUnidadesTiempo();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    unidadTiempoEliminada,
    handleEliminar,
  } = useEliminarUnidadesTiempo();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", equivalenciaMinutos: 0 });
  };

  const columnas = [
    { name: "Nombre", uid: "nombre"},
    { name: "Equivalencia minutos", uid: "equivalenciaMinutos" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: UnidadesTiempo, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "equivalenciaMinutos":
        return <span>{item.equivalenciaMinutos}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof UnidadesTiempo])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las unidades de tiempo</p>;

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

      {/* Modales */}
      {isEditModalOpen && unidadTiempoEditada && (
        <EditarUnidadesTiempoModal
          unidadTiempo={unidadTiempoEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearUnidadesTiempoModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && unidadTiempoEliminada && (
        <EliminarUnidadesTiempoModal
          unidadTiempo={unidadTiempoEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
