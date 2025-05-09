import { useGetEras } from "../../hooks/eras/useGetEras";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";
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
  const { data: eras, isLoading, error } = useGetEras();
  const { data: lotes } = useGetLotes();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    ErasEditada,
    handleEditar,
  } = useEditarEras();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearEras();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    ErasEliminada,
    handleEliminar,
  } = useEliminarEras();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      tipo: "",
      fk_lote: { nombre: "" },
      latI1: null,
      longI1: null,
      latS1: null,
      longS1: null,
      latI2: null,
      longI2: null,
      latS2: null,
      longS2: null,
    });
  };

  const columnas = [
    { name: "Tipo", uid: "tipo", sortable: true },
    { name: "Lote", uid: "fk_lote", sortable: true },
    { name: "LatI1", uid: "latI1" },
    { name: "LongI1", uid: "longI1" },
    { name: "LatS1", uid: "latS1" },
    { name: "LongS1", uid: "longS1" },
    { name: "LatI2", uid: "latI2" },
    { name: "LongI2", uid: "longI2" },
    { name: "LatS2", uid: "latS2" },
    { name: "LongS2", uid: "longS2" },
    { name: "Acciones", uid: "acciones" },
  ];

  const getLoteNombre = (fk_lote: any): string => {
    // Si ya viene el nombre desde el backend
    if (typeof fk_lote === "object" && fk_lote?.nombre) return fk_lote.nombre;

    // Si solo viene un ID, lo buscamos en los lotes
    if (typeof fk_lote === "number" && lotes) {
      const loteEncontrado = lotes.find((l) => l.id === fk_lote);
      return loteEncontrado?.nombre ?? "Sin asignar";
    }

    return "Sin asignar";
  };

  const renderCell = (item: Eras, columnKey: React.Key) => {
    switch (columnKey) {
      case "tipo":
        return <span>{item.tipo}</span>;
      case "fk_lote":
        return <span>{getLoteNombre(item.fk_lote)}</span>;
      case "latI1":
        return <span>{item.latI1}</span>;
      case "longI1":
        return <span>{item.longI1}</span>;
      case "latS1":
        return <span>{item.latS1}</span>;
      case "longS1":
        return <span>{item.longS1}</span>;
      case "latI2":
        return <span>{item.latI2}</span>;
      case "longI2":
        return <span>{item.longI2}</span>;
      case "latS2":
        return <span>{item.latS2}</span>;
      case "longS2":
        return <span>{item.longS2}</span>;
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
        datos={eras || []}
        columnas={columnas}
        claveBusqueda="tipo"
        placeholderBusqueda="Buscar por tipo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && ErasEditada && (
        <EditarEraModal era={ErasEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearEraModal onClose={closeCreateModal} />}

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
