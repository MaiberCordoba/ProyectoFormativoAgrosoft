import { useGetTipoAfecciones } from "../../hooks/tiposAfecciones/useGetTipoAfecciones";
import { useEditarTipoAfeccion } from "../../hooks/tiposAfecciones/useEditarTipoAfeccion";
import { useCrearTipoAfeccion } from "../../hooks/tiposAfecciones/useCrearTipoAfeccion";
import { useEliminarTipoAfeccion } from "../../hooks/tiposAfecciones/useEliminarTipoAfeccion";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarTipoAfeccionModal from "./EditarTipoAfeccionModal";
import { CrearTipoAfeccionModal } from "./CrearTipoAfeccionModal";
import EliminarTipoAfeccionModal from "./EliminarTipoAfeccionModal";
import { TiposAfecciones } from "../../types";

export function TipoAfeccionesList() {
  const { data, isLoading, error } = useGetTipoAfecciones();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    tipoafeccionEditada, 
    handleEditar 
  } = useEditarTipoAfeccion();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearTipoAfeccion();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    tipoafeccionEliminada,
    handleEliminar
  } = useEliminarTipoAfeccion();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", descripcion: "", img: "" });
  };

  // Definición de columnas
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: TiposAfecciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof TiposAfecciones])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los tipos de afección</p>;

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
      {isEditModalOpen && tipoafeccionEditada && (
        <EditarTipoAfeccionModal
        tipoAfeccion={tipoafeccionEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearTipoAfeccionModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && tipoafeccionEliminada && (
        <EliminarTipoAfeccionModal
          tipoAfeccion={tipoafeccionEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
