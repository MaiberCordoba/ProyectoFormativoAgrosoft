import { useGetProductosControl } from "../../hooks/productosControl/useGetProductosControl";
import { useEditarProductosControl } from "../../hooks/productosControl/useEditarProductosControl";
import { useCrearProductosControl } from "../../hooks/productosControl/useCrearProductosControl";
import { useEliminarProductosControl } from "../../hooks/productosControl/useEliminarProductosControl";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarProductosControlModal from "./EditarProductosControlModal";
import { CrearProductosControlModal } from "./CrearProductosControlModal";
import EliminarProductosControlModal from "./EliminarProductosControlModal";
import { ProductosControl } from "../../types";

export function ProductosControlList() {
  const { data, isLoading, error } = useGetProductosControl();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    productosControlEditado, 
    handleEditar 
  } = useEditarProductosControl();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearProductosControl();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    productosControlEliminado,
    handleEliminar
  } = useEliminarProductosControl();

  const handleCrearNuevo = () => {
    handleCrear({ 
      id: 0, 
      nombre: "", 
      precio: 0, 
      compuestoactivo: "", 
      fichatecnica: "", 
      contenido: 0, 
      tipocontenido: "", 
      unidades: 0 
    });
  };

  // Definición de columnas
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Precio", uid: "presio" },
    { name: "Compuesto Activo", uid: "compuestoactivo" },
    { name: "Ficha Técnica", uid: "fichatecnica" },
    { name: "Contenido", uid: "contenido" },
    { name: "Tipo Contenido", uid: "tipocontenido" },
    { name: "Unidades", uid: "unidades" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: ProductosControl, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "presio":
        return <span>{item.precio}</span>;
      case "compuestoactivo":
        return <span>{item.compuestoactivo}</span>;
      case "fichatecnica":
        return <span>{item.fichatecnica}</span>;
      case "contenido":
        return <span>{item.contenido}</span>;
      case "tipocontenido":
        return <span>{item.tipocontenido}</span>;
      case "unidades":
        return <span>{item.unidades}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof ProductosControl])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los productos de control</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && productosControlEditado && (
        <EditarProductosControlModal
          productoControl={productosControlEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearProductosControlModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && productosControlEliminado && (
        <EliminarProductosControlModal
          productoControl={productosControlEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
