import { useState } from "react";
import { useDesechos } from "../hooks/useDesechos"; 
import TableComponent from "@/components/Table";
import DetallesDesechos from "./detallesDesechos";
import { Desechos } from "../types"; 
import { Button } from "@heroui/react";
import { deleteDesechos } from "../api/desechosApi";

export function DesechosList() {
  const { data, isLoading, error, refetch } = useDesechos(); // Agregar refetch para actualizar datos
  const [selectedDesechos, setSelectedDesechos] = useState<Desechos | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Nuevo estado para distinguir detalles/editar

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los Desechos</p>;
  if (!data || data.length === 0) return <p>No se encontraron Desechos.</p>;

  // Definir columnas
  const DesechosColumns: { key: keyof Desechos | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "fk_Cultivo", label: "fk_Cultivo" },
    { key: "fk_TipoDesecho", label: "fk_tipoDesecho" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripcion" },
    { key: "acciones", label: "Acciones"}
  ];

  // Función para abrir el modal con detalles
  const handleDetailsClick = (desechos: Desechos) => {
    setSelectedDesechos(desechos);
    setIsEditMode(false); // Modo solo lectura
    setModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleEditClick = (desechos: Desechos) => {
    setSelectedDesechos(desechos);
    setIsEditMode(true); // Modo edición
    setModalOpen(true);
  };
// Funcion para eliminar un Registro
  const handleDeleteClick =async (desechos : Desechos) => {
    try{
        await deleteDesechos(desechos.id)
        alert("Desecho Eliminado exitosamente")
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
      <TableComponent<Desechos>
        columns={DesechosColumns}
        data={data}
        renderActions={(desechos) => (
          <div className="flex gap-2">
            <Button color="primary" size="sm" onClick={() => handleDetailsClick(desechos)}>
              Detalles
            </Button>
            <Button color="warning" size="sm" onClick={() => handleEditClick(desechos)}>
              Editar
            </Button>
            <Button color="danger" size="sm" onClick={() => handleDeleteClick(desechos)}>
                Eliminar
            </Button>
          </div>
        )}
      />
      {/* Modal reutilizable */}
      <DetallesDesechos 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        desechos={selectedDesechos} 
        isEditMode={isEditMode} 
        onSaveSuccess={() => {
          setModalOpen(false); // Cerrar modal al guardar
          refetch(); // Recargar lista de actividades
        }}
      />
    </div>
  );
}
