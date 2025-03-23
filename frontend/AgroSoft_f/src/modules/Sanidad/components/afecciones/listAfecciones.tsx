import { useState } from "react";
import { useAfecciones } from "../../hooks/afecciones/useAfecciones";
import { Afecciones } from "../../types";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable"; // Asegúrate de importar la tabla
import { AccionesTabla } from "@/components/ui/table/AccionesTabla"; // Asegúrate de importar el componente de acciones
import { UseModal } from "@/hooks/useModal"; // Importa el hook useModal
import EditarAfeccionModal from "./EditarAfeccionModal"; // Importa el componente EditarAfeccionModal

export function AfeccionesList() {
  const { data, isLoading, error } = useAfecciones();

  // Usar el hook useModal para manejar el estado del modal
  const { isOpen, openModal, closeModal } = UseModal();

  // Estado para almacenar la afección que se está editando
  const [afeccionEditada, setAfeccionEditada] = useState<Afecciones | null>(null);

  // Función para manejar la acción de editar
  const handleEditar = (afeccion: Afecciones) => {
    setAfeccionEditada(afeccion); // Guarda la afección que se está editando
    openModal(); // Abre el modal
  };

  // Definir las columnas de la tabla
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tipo afectacion", uid: "tipoPlaga" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función para renderizar las celdas
  const renderCell = (item: Afecciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tipoPlaga":
        return <span>{item.tipoPlaga.nombre}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)} // Pasa la función handleEditar
            onEliminar={() => console.log("Eliminar", item)}
          />
        );
      default:
        const value = item[columnKey as keyof Afecciones];
        // Verificamos si `value` es un objeto y tiene la propiedad `nombre`
        if (value && typeof value === "object" && "nombre" in value) {
          return <span>{value.nombre}</span>;
        }
        // Si no es un objeto, lo convertimos a un string
        return <span>{String(value)}</span>;
    }
  };

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
      <TablaReutilizable
        datos={data} // Pasa los datos de las afecciones
        columnas={columnas} // Pasa las columnas definidas
        claveBusqueda="nombre" // Define la clave de búsqueda
        renderCell={renderCell} // Pasa la función para renderizar las celdas
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