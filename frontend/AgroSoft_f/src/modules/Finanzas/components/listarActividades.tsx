import { useState } from "react";
import { useActividades } from "../hooks/useActividades"; 
import TableComponent from "@/components/Table";
import DetallesActividades from "./detallesActividades";
import { Actividades } from "../types"; 
import { Button } from "@heroui/react";
import { deleteActividades } from "../api/actividadesApi";

export function ActividadesList() {
  const { data, isLoading, error, refetch } = useActividades(); // Agregar refetch para actualizar datos
  const [selectedActividades, setSelectedActividades] = useState<Actividades | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Nuevo estado para distinguir detalles/editar

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las Actividades</p>;
  if (!data || data.length === 0) return <p>No se encontraron Actividades.</p>;

  // Definir columnas
  const ActividadesColumns: { key: keyof Actividades | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "fk_Cultivo", label: "fk_Cultivo" },
    { key: "fk_Usuario", label: "fk_Usuario" },
    { key: "titulo", label: "Titulo" },
    { key: "descripcion", label: "Descripcion" },
    { key: "fecha", label: "Fecha" },
    { key: "estado", label: "Estado" },
    { key: "acciones", label: "Acciones" },
  ];

  // Función para abrir el modal con detalles
  const handleDetailsClick = (actividades: Actividades) => {
    setSelectedActividades(actividades);
    setIsEditMode(false); // Modo solo lectura
    setModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleEditClick = (actividades: Actividades) => {
    setSelectedActividades(actividades);
    setIsEditMode(true); // Modo edición
    setModalOpen(true);
  };
// Funcion para eliminar un Registro
  const handleDeleteClick =async (actividades : Actividades) => {
    try{
        await deleteActividades(actividades.id)
        alert("Actividad Eliminada exitosamente")
        refetch()
    }catch(error){
        alert("Ocurrio un error al eliminar")
        console.error(error)
    }
  }
  return (
    <div className="p-4">
      <h1 className="text-center font-bold mb-4">Actividades</h1>
      <br />
      <TableComponent<Actividades>
        columns={ActividadesColumns}
        data={data}
        renderActions={(actividades) => (
          <div className="flex gap-2">
            <Button color="primary" size="sm" onClick={() => handleDetailsClick(actividades)}>
              Detalles
            </Button>
            <Button color="warning" size="sm" onClick={() => handleEditClick(actividades)}>
              Editar
            </Button>
            <Button color="danger" size="sm" onClick={() => handleDeleteClick(actividades)}>
                Eliminar
            </Button>
          </div>
        )}
      />
      {/* Modal reutilizable */}
      <DetallesActividades 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        actividades={selectedActividades} 
        isEditMode={isEditMode} 
        onSaveSuccess={() => {
          setModalOpen(false); // Cerrar modal al guardar
          refetch(); // Recargar lista de actividades
        }}
      />
    </div>
  );
}
