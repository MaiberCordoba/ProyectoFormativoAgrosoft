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
    handleEditar 
  } = useEditarLotes();

  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearLotes();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    LotesEliminada,
    handleEliminar
  } = useEliminarLotes();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", descripcion: "", tamX: 0, tamY: 0, estado: false, posX: 0.0, posY: 0.0 });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tamaño X", uid: "tamX" },
    { name: "Tamaño Y", uid: "tamY" },
    { name: "Estado", uid: "estado" },
    { name: "Posición X", uid: "posX" },
    { name: "Posición Y", uid: "posY" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Lotes, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tamX":
        return <span>{item.tamX}</span>;
      case "tamY":
        return <span>{item.tamY}</span>;
      case "estado":
        return <span>{item.estado ? "Disponible" : "Ocupado"}</span>;
      case "posX":
        return <span>{item.posX}</span>;
      case "posY":
        return <span>{item.posY}</span>;
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
        claveBusqueda="id"
        placeholderBusqueda="Buscar por ID"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && LotesEditada && (
        <EditarLoteModal
          lote={LotesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearLoteModal
          onClose={closeCreateModal}
        />
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
