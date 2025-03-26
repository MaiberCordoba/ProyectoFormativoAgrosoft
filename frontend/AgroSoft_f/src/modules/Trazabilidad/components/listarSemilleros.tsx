import { useState } from "react";
import { useSemilleros } from "../hooks/useHooks";
import TableComponent from "@/components/Table";
import ModalComponent from "@/components/Modal";
import { Semilleros } from "@/modules/Trazabilidad/types";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

export function SemilleroList() {
  const { data: semilleros, isLoading, error } = useSemilleros();
  const [selectedSemillero, setSelectedSemillero] = useState<Semilleros | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los semilleros</p>;


  if (!semilleros || semilleros.length === 0) return <p>No se encontraron semilleros.</p>;

  const handleDetailsClick = (semillero: Semilleros) => {
  const semilleroColumns: { key: keyof Semilleros | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "fk_Especie", label: "Especie" },
    { key: "unidades", label: "Unidades" },
    { key: "fechaSiembra", label: "Fecha de Siembra" },
    { key: "fechaEstimada", label: "Fecha Estimada" },
    { key: "acciones", label: "Acciones" },
  ];

    setSelectedSemillero(semillero);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link to="/crearSemilleros">
          <Button color="success" size="md">Crear Semillero</Button>
        </Link>
      </div>
      <br />
      <h1 className="text-xl font-bold mb-4">Lista de Semilleros</h1>
      <br />
      {(!semilleros || semilleros.length === 0) ? (
        <p>No se encontraron semilleros.</p>
      ) : (
        <TableComponent<Semilleros>
        columns={[
          { key: "id", label: "ID" },
          { key: "fk_Especie", label: "Especie" },
          { key: "unidades", label: "Unidades" },
          { key: "fechaSiembra", label: "Fecha de Siembra" },
          { key: "fechaEstimada", label: "Fecha Estimada" },
          { key: "acciones", label: "Acciones" }
        ]}
        data={semilleros}
        renderActions={(semillero) => (
          <div className="flex gap-2">
            <Button color="primary" size="sm" onClick={() => handleDetailsClick(semillero)}>
              Detalles
            </Button>
            <Link to={`/editarSemillero/${semillero.id}`}>
              <Button color="warning" size="sm">Editar</Button>
            </Link>
          </div>
        )}
      />
      )}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalles del Semillero"
        footerButtons={[{ label: "Cerrar", color: "danger", onClick: () => setModalOpen(false) }]}
      >
        {selectedSemillero && (
          <div>
            <p><strong>ID:</strong> {selectedSemillero.id}</p>
            <p><strong>Especie:</strong> {selectedSemillero.fk_Especie}</p>
            <p><strong>Unidades:</strong> {selectedSemillero.unidades}</p>
            <p><strong>Fecha de Siembra:</strong> {selectedSemillero.fechaSiembra}</p>
            <p><strong>Fecha Estimada:</strong> {selectedSemillero.fechaEstimada}</p>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
