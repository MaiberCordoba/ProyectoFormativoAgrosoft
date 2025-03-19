import { useState } from "react";
import { useCosechas } from "../hooks/useCosechas"; 
import TableComponent from "@/components/Table";
import DetallesCosechas from "./detallesCosechas";
import { Cosechas } from "../types"; 
import { Button } from "@heroui/react";

export function CosechasList() {
  const { data, isLoading, error } = useCosechas();
  const [selectedCosechas, setSelectedCosechas] = useState<Cosechas | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las cosechas</p>;
  if (!data || data.length === 0) return <p>No se encontraron cosechas.</p>;

  // Definir columnas con claves estrictamente de tipo keyof User
  const CosechasColumns: { key: keyof Cosechas | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "fk_Cultivo", label: "fk_Cultivo" },
    { key: "unidades", label: "Unidades" },
    { key: "fecha", label: "Fecha" },
    { key: "acciones", label: "Editar" },  // Nueva columna para el botón
    
  ];

  // Función para abrir el modal con detalles de Cosechas
  const handleDetailsClick = (cosechas: Cosechas) => {
    setSelectedCosechas(cosechas);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-center font-bold mb-4">Cosechas</h1>
      <br />
      <TableComponent<Cosechas>
        columns={CosechasColumns}
        data={data}
        renderActions={(cosechas) => (
          <Button color="primary" size="sm" onClick={() => handleDetailsClick(cosechas)}>
            Detalles
          </Button>
        )}
      />
      {/* Modal reutilizable */}
      <DetallesCosechas 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        cosechas={selectedCosechas} 
      />

    </div>
  );
}