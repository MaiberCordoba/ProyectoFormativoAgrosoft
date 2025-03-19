import { useState } from "react";
import { useAfecciones } from "../hooks/useAfecciones"; 
import TableComponent from "@/components/Table";
import DetallesAfecciones from "./detallesAfecciones";
import { Afecciones } from "../types"; 
import { Button } from "@heroui/react";

export function AfeccionesList() {
  const { data, isLoading, error } = useAfecciones();
  const [selectedAfecciones, setSelectedAfecciones] = useState<Afecciones | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las afectaciones</p>;
  if (!data || data.length === 0) return <p>No se encontraron afectaciones.</p>;

  // Definir columnas con claves estrictamente de tipo keyof User
  const afeccionesColumns: { key: keyof Afecciones | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "descripcion" },
    { key: "acciones", label: "Acciones" },
    { key: "acciones", label: "Editar" },  // Nueva columna para el botón
    
  ];

  // Función para abrir el modal con detalles de afecciones
  const handleDetailsClick = (afeccion: Afecciones) => {
    setSelectedAfecciones(afeccion);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-center font-bold mb-4">AFECCIONES</h1>
      <br />
      <TableComponent<Afecciones>
        columns={afeccionesColumns}
        data={data}
        renderActions={(afeccion) => (
          <Button color="primary" size="sm" onClick={() => handleDetailsClick(afeccion)}>
            Detalles
          </Button>
        )}
      />
      {/* Modal reutilizable */}
      <DetallesAfecciones 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        afeccion={selectedAfecciones} 
      />

    </div>
  );
}
