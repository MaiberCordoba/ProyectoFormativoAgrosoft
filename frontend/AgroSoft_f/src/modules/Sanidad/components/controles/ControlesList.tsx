import { useGetControles } from "../../hooks/controles/useGetControless";
import { useEditarControl } from "../../hooks/controles/useEditarControles";
import { useCrearControl } from "../../hooks/controles/useCrearControles";
import { useEliminarControl } from "../../hooks/controles/useEliminarControles";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarControlModal from "./EditarControlesModal";
import { CrearControlModal } from "./CrearControlesModal";
import EliminarControlModal from "./EliminaControles";
import { Controles } from "../../types";

export function ControlesList() {
  const { data, isLoading, error } = useGetControles();
  
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    controlEditado, 
    handleEditar 
  } = useEditarControl();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearControl();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    controlEliminado,
    handleEliminar
  } = useEliminarControl();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Afeccion: 0, fk_TipoControl: 0, fecha: "", descripcion: "" });
  };

  // Definición de columnas
  const columnas = [
    { name: "Fecha", uid: "fecha", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Afección", uid: "fk_Afeccion" },
    { name: "Tipo de Control", uid: "fk_TipoControl" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Renderizado de celdas
  const renderCell = (item: Controles, columnKey: React.Key) => {
    switch (columnKey) {
      case "fecha":
        return <span>{item.fecha}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "fk_Afeccion":
        return <span>{item.fk_Afeccion || "No definido"}</span>;
      case "fk_TipoControl":
        return <span>{item.fk_TipoControl || "No definido"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Controles])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los controles</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="descripcion"
        placeholderBusqueda="Buscar por descripción"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && controlEditado && (
        <EditarControlModal
          control={controlEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearControlModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && controlEliminado && (
        <EliminarControlModal
          control={controlEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
