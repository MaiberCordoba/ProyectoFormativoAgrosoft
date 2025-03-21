import { useState } from "react";
import { useHerramientas } from "../hooks/useHerramientas"; 
import TableComponent from "@/components/Table";
import DetallesHerramientas from "./detallesHerramientas";
import { Herramientas } from "../types"; 
import { Button } from "@heroui/react";
import { deleteHerramientas } from "../api/herramientasApi";

export function HerramientasList() {
  const { data, isLoading, error, refetch } = useHerramientas(); // Agregar refetch para actualizar datos
  const [selectedHerramientas, setSelectedHerramientas] = useState<Herramientas | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Nuevo estado para distinguir detalles/editar

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las Herramientas</p>;
  if (!data || data.length === 0) return <p>No se encontraron Herramientas.</p>;

  // Definir columnas
  const HerramientasColumns: { key: keyof Herramientas | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "fk_Lote", label: "fk_Lote" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripcion" },
    { key: "unidades", label: "Unidades" },
    { key: "acciones", label: "Acciones" },
  ];

  // Función para abrir el modal con detalles
  const handleDetailsClick = (herramientas: Herramientas) => {
    setSelectedHerramientas(herramientas);
    setIsEditMode(false); // Modo solo lectura
    setModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleEditClick = (herramientas: Herramientas) => {
    setSelectedHerramientas(herramientas);
    setIsEditMode(true); // Modo edición
    setModalOpen(true);
  };
// Funcion para eliminar un Registro
  const handleDeleteClick =async (herramientas : Herramientas) => {
    try{
        await deleteHerramientas(herramientas.id)
        alert("Herramienta Eliminada exitosamente")
        refetch()
    }catch(error){
        alert("Ocurrio un error al eliminar")
        console.error(error)
    }
  }
  return (
    <div className="p-4">
      <h1 className="text-center font-bold mb-4">Herramientas</h1>
      <br />
      <TableComponent<Herramientas>
        columns={HerramientasColumns}
        data={data}
        renderActions={(herramientas) => (
          <div className="flex gap-2">
            <Button color="primary" size="sm" onClick={() => handleDetailsClick(herramientas)}>
              Detalles
            </Button>
            <Button color="warning" size="sm" onClick={() => handleEditClick(herramientas)}>
              Editar
            </Button>
            <Button color="danger" size="sm" onClick={() => handleDeleteClick(herramientas)}>
                Eliminar
            </Button>
          </div>
        )}
      />
      {/* Modal reutilizable */}
      <DetallesHerramientas
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        herramientas={selectedHerramientas} 
        isEditMode={isEditMode} 
        onSaveSuccess={() => {
          setModalOpen(false); // Cerrar modal al guardar
          refetch(); // Recargar lista de actividades
        }}
      />
    </div>
  );
}
