import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useEditarUnidadesMedida } from "../../hooks/unidadesMedida/useEditarUnidadesMedida";
import { useCrearUnidadesMedida } from "../../hooks/unidadesMedida/useCrearUnidadesMedida";
import { useEliminarUnidadesMedida } from "../../hooks/unidadesMedida/useEliminarUnidadesMedida";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarUnidadesMedidaModal from "./EditarUnidadesMedidaModal";
import { CrearUnidadesMedidaModal } from "./CrearUnidadesMedidaModal";
import EliminarUnidadesMedidaModal from "./EliminarUnidadesMedida";
import { UnidadesMedida } from "../../types";

export function UnidadesMedidaList() {
  const { data, isLoading, error } = useGetUnidadesMedida();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    unidadMedidaEditada,
    handleEditar,
  } = useEditarUnidadesMedida();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUnidadesMedida();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    unidadMedidaEliminada,
    handleEliminar,
  } = useEliminarUnidadesMedida();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      nombre: "",
      abreviatura: "",
      tipo: "MASA",
      equivalenciabase: 0,
    });
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Abreviatura", uid: "abreviatura" },
    { name: "Tipo", uid: "tipo" },
    { name: "Equivalencia (g)", uid: "equivalenciabase" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: UnidadesMedida, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "abreviatura":
        return <span>{item.abreviatura}</span>;
      case "tipo":
        return <span>{item.tipo}</span>;
      case "equivalenciabase":
        return <span>{item.equivalenciabase}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof UnidadesMedida])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las unidades de medida</p>;

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
      {isEditModalOpen && unidadMedidaEditada && (
        <EditarUnidadesMedidaModal
          unidadMedida={unidadMedidaEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearUnidadesMedidaModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && unidadMedidaEliminada && (
        <EliminarUnidadesMedidaModal
          unidadMedida={unidadMedidaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
