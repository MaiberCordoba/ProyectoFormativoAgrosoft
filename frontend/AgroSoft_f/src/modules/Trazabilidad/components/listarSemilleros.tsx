import { useState } from "react"; 

import { useSemilleros } from "../hooks/useSemillero";
import TableComponent from "@/components/Table";
import ModalComponent from "@/components/Modal";
import { Semillero } from "@/modules/Trazabilidad/types";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

export function SemilleroList() {
  const { data: semilleros, isLoading, error } = useSemilleros();
  const [selectedSemillero, setSelectedSemillero] = useState<Semillero | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los semilleros</p>;
  if (!semilleros || semilleros.length === 0) return <p>No se encontraron semilleros.</p>;

  const semilleroColumns: { key: keyof Semillero | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },

    { key: "fk_especie", label: "Especie" }, // Se cambió a minúsculas
    { key: "unidades", label: "Unidades" },
    { key: "fechasiembra", label: "Fecha de Siembra" }, // Se cambió a minúsculas
    { key: "fechaestimada", label: "Fecha Estimada" }, // Se cambió a minúsculas

    { key: "acciones", label: "Acciones" },
  ];

  const handleDetailsClick = (semillero: Semillero) => {
    setSelectedSemillero(semillero);
    setModalOpen(true);
  };

  return (
    <div className="p-4">


      {/* Botón corregido para redirigir a /crearSemilleros */}
      <div className="mb-4">
        <Link to="/crearSemilleros">
          <Button color="primary" size="md">Crear Semillero</Button>
        </Link>
      </div>
    <br />

      <h1 className="text-xl font-bold mb-4">Lista de Semilleros</h1>
      <TableComponent<Semillero>
        columns={semilleroColumns}
        data={semilleros}
        renderActions={(semillero) => (
          <Button 
            color="primary" 
            size="sm" 
            onClick={() => handleDetailsClick(semillero)}
          >
            Detalles
          </Button>
        )}
      />

      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalles del Semillero"

        footerButtons={[{ label: "Cerrar", color: "danger", onClick: () => setModalOpen(false) }]}

      >
        {selectedSemillero && (
          <div>
            <p><strong>ID:</strong> {selectedSemillero.id}</p>
            <p><strong>Especie:</strong> {selectedSemillero.fk_especie}</p>
            <p><strong>Unidades:</strong> {selectedSemillero.unidades}</p>
            <p><strong>Fecha de Siembra:</strong> {selectedSemillero.fechasiembra}</p>
            <p><strong>Fecha Estimada:</strong> {selectedSemillero.fechaestimada}</p>

          </div>
        )}
      </ModalComponent>
    </div>
  );
}
