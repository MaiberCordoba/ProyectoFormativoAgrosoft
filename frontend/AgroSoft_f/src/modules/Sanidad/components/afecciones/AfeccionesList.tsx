import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { useEditarAfeccion } from "../../hooks/afecciones/useEditarAfeccion";
import { useCrearAfeccion } from "../../hooks/afecciones/useCrearAfeccion";
import { useEliminarAfeccion } from "../../hooks/afecciones/useEliminarAfeccion";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarAfeccionModal from "./EditarAfeccionModal";
import { CrearAfeccionModal } from "./CrearAfeccionModal";
import EliminarAfeccionModal from "./EliminarAfeccion";
import { Afecciones } from "../../types";

export function AfeccionesList() {
  const { data, isLoading, error } = useGetAfecciones();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    afeccionEditada, 
    handleEditar 
  } = useEditarAfeccion();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearAfeccion();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    afeccionEliminada,
    handleEliminar
  } = useEliminarAfeccion();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", descripcion: "", fk_Tipo: 0, img: "" });
  };

  // Definición de columnas movida aquí
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tipo afectación", uid: "tipoPlaga" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado movida aquí
  const renderCell = (item: Afecciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tipoPlaga":
        return <span>{item.tipoPlaga?.nombre || "No definido"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Afecciones])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las afecciones</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable directa */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && afeccionEditada && (
        <EditarAfeccionModal
          afeccion={afeccionEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearAfeccionModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && afeccionEliminada && (
        <EliminarAfeccionModal
          afeccion={afeccionEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}