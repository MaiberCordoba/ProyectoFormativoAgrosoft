import { useGetEras } from "../../hooks/eras/useGetEras";
import { useEditarEras } from "../../hooks/eras/useEditarEras";
import { useCrearEras } from "../../hooks/eras/useCrearEras";
import { useEliminarEras } from "../../hooks/eras/useEliminarEras";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarEraModal from "./EditarErasModal";
import { CrearEraModal } from "./CrearEraModal";
import EliminarEraModal from "./EliminarEras";
import { Eras } from "../../types";

export function EraList() {
  const { data, isLoading, error } = useGetEras();

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    ErasEditada, 
    handleEditar 
  } = useEditarEras();

  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearEras();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    ErasEliminada,
    handleEliminar
  } = useEliminarEras();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_lote_id: 0, tamX: 0, tamY: 0, posX: 0, posY: 0, tipo: "" });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Lote", uid: "fk_lote_id", sortable: true },
    { name: "Tipo", uid: "tipo" },
    { name: "Tamaño X", uid: "tamX" },
    { name: "Tamaño Y", uid: "tamY" },
    { name: "Posición X", uid: "posX" },
    { name: "Posición Y", uid: "posY" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Eras, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "fk_lote_id":
        return <span>{item.fk_lote?.nombre ?? "Sin asignar"}</span>; // 🔥 CORREGIDO AQUÍ
      case "tipo":
        return <span>{item.tipo}</span>;
      case "tamX":
        return <span>{item.tamX}</span>;
      case "tamY":
        return <span>{item.tamY}</span>;
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
        return <span>{String(item[columnKey as keyof Eras])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las eras</p>;

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
      {isEditModalOpen && ErasEditada && (
        <EditarEraModal
          era={ErasEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearEraModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && ErasEliminada && (
        <EliminarEraModal
          era={ErasEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
