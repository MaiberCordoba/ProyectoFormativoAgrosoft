import { useState } from "react";
import { useCosechas } from "../hooks/useCosechas"; 
import TableComponent from "@/components/Table";
import DetallesCosechas from "./detallesCosechas";
import { Cosechas } from "../types"; 
import { Button } from "@heroui/react";
import { deleteCosechas } from "../api/cosechasApi";

export function CosechasList() {
  const { data, isLoading, error, refetch } = useCosechas(); // Agregar refetch para actualizar datos
  const [selectedCosechas, setSelectedCosechas] = useState<Cosechas | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Nuevo estado para distinguir detalles/editar

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las Cosechas</p>;
  if (!data || data.length === 0) return <p>No se encontraron Cosechas.</p>;

  // Definir columnas
  const CosechasColumns: { key: keyof Cosechas | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "fk_Cultivo", label: "fk_Cultivo" },
    { key: "unidades", label: "Unidades" },
    { key: "fecha", label: "Fecha" },
    { key: "acciones", label: "Acciones" },
  ];

  // Función para abrir el modal con detalles
  const handleDetailsClick = (cosechas: Cosechas) => {
    setSelectedCosechas(cosechas);
    setIsEditMode(false); // Modo solo lectura
    setModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleEditClick = (cosechas: Cosechas) => {
    setSelectedCosechas(cosechas);
    setIsEditMode(true); // Modo edición
    setModalOpen(true);
  };
// Funcion para eliminar un Registro
  const handleDeleteClick =async (cosechas : Cosechas) => {
    try{
        await deleteCosechas(cosechas.id)
        alert("Cosecha Eliminada exitosamente")
        refetch()
    }catch(error){
        alert("Ocurrio un error al eliminar")
        console.error(error)
    }
  }
  return (
    <div className="p-4">
      <h1 className="text-center font-bold mb-4">Cosechas</h1>
      <br />
      <TableComponent<Cosechas>
        columns={CosechasColumns}
        data={data}
        renderActions={(cosechas) => (
          <div className="flex gap-2">
            <Button color="primary" size="sm" onClick={() => handleDetailsClick(cosechas)}>
              Detalles
            </Button>
            <Button color="warning" size="sm" onClick={() => handleEditClick(cosechas)}>
              Editar
            </Button>
            <Button color="danger" size="sm" onClick={() => handleDeleteClick(cosechas)}>
                Eliminar
            </Button>
          </div>
        )}
      />
      {/* Modal reutilizable */}
      <DetallesCosechas
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        cosechas={selectedCosechas} 
        isEditMode={isEditMode} 
        onSaveSuccess={() => {
          setModalOpen(false); // Cerrar modal al guardar
          refetch(); // Recargar lista de actividades
        }}
      />
    </div>
  );
}
