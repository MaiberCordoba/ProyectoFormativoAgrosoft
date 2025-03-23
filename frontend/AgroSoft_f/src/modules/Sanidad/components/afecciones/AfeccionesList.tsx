import { useAfecciones } from "../../hooks/afecciones/useAfecciones";
import { AfeccionesTabla } from "./AfeccionesTabla"; // Importa el componente de tabla
import { useEditarAfeccion } from "../../hooks/afecciones/useEditarAfeccion"; // Importa el hook de edición
import EditarAfeccionModal from "./EditarAfeccionModal"; // Importa el modal de edición

export function AfeccionesList() {
  const { data, isLoading, error } = useAfecciones();
  const { isOpen, closeModal, afeccionEditada, handleEditar } = useEditarAfeccion();

  // Función para manejar la acción de "crearOtro"
  const handleCrearNuevo = () => {
    console.log("Crear nueva afección");
    // Aquí puedes abrir un modal, hacer una petición API, etc.
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
      {isOpen && afeccionEditada && (
        <EditarAfeccionModal
          afeccion={afeccionEditada} // Pasa la afección que se está editando
          onClose={closeModal} // Pasa la función para cerrar el modal
        />
      )}
    </div>
  );
}