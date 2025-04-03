import { useGetUsosProductos } from "../../hooks/usosProductos/useGetUsosProductos";
import { useEditarUsoProducto } from "../../hooks/usosProductos/useEditarUsosProductos";
import { useCrearUsosProducto } from "../../hooks/usosProductos/useCrearUsosProductos";
import { useEliminarUsoProducto } from "../../hooks/usosProductos/useEliminarUsosProductos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarUsosProductosModal from "./EditarUsosProductosModal";
import { CrearUsosProductosModal } from "./CrearUsosProductosModal";
import EliminarUsoProductoModal from "./EliminarUsosProductos";
import { UsosProductos } from "../../types";

export function UsosProductosList() {
  const { data, isLoading, error } = useGetUsosProductos();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    usoProductoEditado, 
    handleEditar 
  } = useEditarUsoProducto();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearUsosProducto();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    usoProductoEliminado,
    handleEliminar
  } = useEliminarUsoProducto();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Insumo: 0, fk_Actividad: 0, cantidadProducto: 0 });
  };

  // Definición de columnas
  const columnas = [
    { name: "Insumo", uid: "insumo" },
    { name: "Actividad", uid: "actividad" },
    { name: "Cantidad", uid: "cantidadProducto" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: UsosProductos, columnKey: React.Key) => {
    switch (columnKey) {
      case "insumo":
        return <span>{item.insumo?.nombre || "No definido"}</span>;
      case "actividad":
        return <span>{item.actividad?.titulo || "No definida"}</span>;
      case "cantidadProducto":
        return <span>{item.cantidadProducto}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof UsosProductos])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los Usos de Productos</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="insumo"
        placeholderBusqueda="Buscar por insumo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && usoProductoEditado && (
        <EditarUsosProductosModal
          usoProducto={usoProductoEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearUsosProductosModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && usoProductoEliminado && (
        <EliminarUsoProductoModal
          usoProducto={usoProductoEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
