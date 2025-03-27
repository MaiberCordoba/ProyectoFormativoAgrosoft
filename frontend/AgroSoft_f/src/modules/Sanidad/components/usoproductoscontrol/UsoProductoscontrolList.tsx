import { usegetUsoProductosControl } from "../../hooks/useProductosControl/useGetUseProductosControl";
import { useEditarUsoProductosControl } from "../../hooks/useProductosControl/useEditarUseProductosControl";
import { useCrearUsoProductosControl } from "../../hooks/useProductosControl/useCrearUseProductosControl";
import { useEliminarUsoProductosControl } from "../../hooks/useProductosControl/useEliminarUseProductosControl";

import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";

import EditarUsoProductosControlModal from "./EditarUsoProductoscontrolModal";
import { CrearUsoProductosControlModal } from "./CrearUsoProductoscontrolModal";
import EliminarUsoProductosControlModal from "./EliminarUsoProductoscontrolModal";

import { UsoProductosControl } from "../../types";

export function UsoProductosControlList() {
  const { data, isLoading, error } = usegetUsoProductosControl();
  
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    usoproductosControlEditado, 
    handleEditar 
  } = useEditarUsoProductosControl();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearUsoProductosControl();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    usoproductosControlEliminado,
    handleEliminar
  } = useEliminarUsoProductosControl();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_ProductoControl:0, fk_Control: 0, cantidadProducto: 0 });
  };

  // Definición de columnas
  const columnas = [
    { name: "Producto de Control", uid: "productoControl" },
    { name: "Control Aplicado", uid: "control" },
    { name: "Cantidad", uid: "cantidadProducto" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: UsoProductosControl, columnKey: React.Key) => {
    switch (columnKey) {
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
        return <span>{String(item[columnKey as keyof UsoProductosControl])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fk_ProductoControl"
        placeholderBusqueda="Buscar por producto"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && usoproductosControlEditado && (
        <EditarUsoProductosControlModal
          usoProductoControl={usoproductosControlEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearUsoProductosControlModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && usoproductosControlEliminado && (
        <EliminarUsoProductosControlModal
          usoProductoControl={usoproductosControlEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
