import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { AfeccionesTabla } from "./AfeccionesTabla";
import { useEditarAfeccion } from "../../hooks/afecciones/useEditarAfeccion";
import { useCrearAfeccion } from "../../hooks/afecciones/useCrearAfeccion";
import EditarAfeccionModal from "./EditarAfeccionModal";
import { CrearAfeccionModal } from "./CrearAfeccionModal";

export function AfeccionesList() {
  const { data, isLoading, error } = useGetAfecciones();
  const { isOpen: isEditModalOpen, closeModal: closeEditModal, afeccionEditada, handleEditar } = useEditarAfeccion();
  const { isOpen: isCreateModalOpen, closeModal: closeCreateModal, handleCrear } = useCrearAfeccion();

  // Función para manejar la acción de "crearOtro"
  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", descripcion: "", fk_Tipo: 0, img: "" }); // Abre el modal de creación con una afección vacía
  };

  // Manejo de estados de carga y error
  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las afecciones</p>;
  if (!data || data.length === 0) return <p>No se encontraron afecciones.</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <AfeccionesTabla
        data={data} // Pasa los datos de las afecciones
        onEditar={handleEditar} // Pasa la función para editar
        onCrearNuevo={handleCrearNuevo} // Pasa la función para crear una nueva afección
      />

      {/* Modal de edición */}
      {isEditModalOpen && afeccionEditada && (
        <EditarAfeccionModal
          afeccion={afeccionEditada} // Pasa la afección que se está editando
          onClose={closeEditModal} // Pasa la función para cerrar el modal
        />
      )}

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <CrearAfeccionModal
          onClose={closeCreateModal} // Pasa la función para cerrar el modal
        />
      )}
    </div>
  );
}