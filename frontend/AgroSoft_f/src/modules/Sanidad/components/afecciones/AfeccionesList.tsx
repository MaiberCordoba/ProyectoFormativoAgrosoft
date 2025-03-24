import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { AfeccionesTabla } from "./AfeccionesTabla";
import { useEditarAfeccion } from "../../hooks/afecciones/useEditarAfeccion";
import { useCrearAfeccion } from "../../hooks/afecciones/useCrearAfeccion";
import { useEliminarAfeccion } from "../../hooks/afecciones/useEliminarAfeccion";
import EditarAfeccionModal from "./EditarAfeccionModal";
import { CrearAfeccionModal } from "./CrearAfeccionModal";
import EliminarAfeccionModal from "./EliminarAfeccion";

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
  } = useEliminarAfeccion(); // Sin parámetro refetch

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", descripcion: "", fk_Tipo: 0, img: "" });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las afecciones</p>;
  if (!data || data.length === 0) return (
    <div className="p-4">
      <AfeccionesTabla
        data={[]}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        onCrearNuevo={handleCrearNuevo}
      />
      <CrearAfeccionModal
        onClose={closeCreateModal}
      />
    </div>
  );

  return (
    <div className="p-4">
      <AfeccionesTabla
        data={data}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modal de edición */}
      {isEditModalOpen && afeccionEditada && (
        <EditarAfeccionModal
          afeccion={afeccionEditada}
          onClose={closeEditModal}
        />
      )}

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <CrearAfeccionModal
          onClose={closeCreateModal}
        />
      )}

      {/* Modal de eliminación */}
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