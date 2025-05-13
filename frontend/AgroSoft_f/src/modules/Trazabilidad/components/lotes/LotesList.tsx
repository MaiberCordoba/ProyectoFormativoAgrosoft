import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import { useEditarLotes } from "../../hooks/lotes/useEditarLotes";
import { useCrearLotes } from "../../hooks/lotes/useCrearLotes";
import { useEliminarLotes } from "../../hooks/lotes/useEliminarLotes";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarLoteModal from "./EditarLotesModal";
import { CrearLoteModal } from "./CrearLotesModal";
import EliminarLoteModal from "./EliminarLotes";
import { Lotes } from "../../types";

export function LoteList() {
  const { data, isLoading, error } = useGetLotes();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    LotesEditada,
    handleEditar,
  } = useEditarLotes();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearLotes();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    LotesEliminada,
    handleEliminar,
  } = useEliminarLotes();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      nombre: "",
      descripcion: "",
      latI1: 0,
      longI1: 0,
      latS1: 0,
      longS1: 0,
      latI2: 0,
      longI2: 0,
      latS2: 0,
      longS2: 0,
      estado: true,
    });
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "LatI1", uid: "latI1" },
    { name: "LongI1", uid: "longI1" },
    { name: "LatS1", uid: "latS1" },
    { name: "LongS1", uid: "longS1" },
    { name: "LatI2", uid: "latI2" },
    { name: "LongI2", uid: "longI2" },
    { name: "LatS2", uid: "latS2" },
    { name: "LongS2", uid: "longS2" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Lotes, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
      case "descripcion":
      case "latI1":
      case "longI1":
      case "latS1":
      case "longS1":
      case "latI2":
      case "longI2":
      case "latS2":
      case "longS2":
        return <span>{item[columnKey as keyof Lotes]}</span>;
      case "estado":
        return <span>{item.estado ? "Disponible" : "Ocupado"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Lotes])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los lotes</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por Nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && LotesEditada && (
        <EditarLoteModal lote={LotesEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && (
        <CrearLoteModal onClose={closeCreateModal} onCreate={() => {}} />
      )}

      {isDeleteModalOpen && LotesEliminada && (
        <EliminarLoteModal
          lote={LotesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
