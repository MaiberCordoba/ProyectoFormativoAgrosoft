import { useState } from "react";
import { useEspecies } from "../hooks/useHooks";
import TableComponent from "@/components/Table";
import ModalComponent from "@/components/Modal";
import { Especies } from "@/modules/Trazabilidad/types";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

export function EspecieList() {
  const { data: especies, isLoading, error } = useEspecies();
  const [selectedEspecie, setSelectedEspecie] = useState<Especies | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las especies</p>;

  const handleDetailsClick = (especie: Especies) => {
    setSelectedEspecie(especie);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link to="/crearEspecies">
          <Button color="success" size="md">Crear Especie</Button>
        </Link>
      </div>
      <br />
      <h1 className="text-xl font-bold mb-4">Lista de Especies</h1>
      <br />
      {(!especies || especies.length === 0) ? (
        <p>No se encontraron especies.</p>
      ) : (
        <TableComponent<Especies>
          columns={[
            { key: "id", label: "ID" },
            { key: "fk_TiposEspecie", label: "Tipo de Especie" },
            { key: "nombre", label: "Nombre" },
            { key: "descripcion", label: "Descripción" },
            { key: "img", label: "Imagen" },
            { key: "tiempoCrecimiento", label: "Tiempo de Crecimiento" },
            { key: "acciones", label: "Acciones" }
          ]}
          data={especies}
          renderActions={(especie) => (
            <div className="flex gap-2">
              <Button color="primary" size="sm" onClick={() => handleDetailsClick(especie)}>
                Detalles
              </Button>
              <Link to={`/editarEspecie/${especie.id}`}>
                <Button color="warning" size="sm">Editar</Button>
              </Link>
            </div>
          )}
        />
      )}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalles de la Especie"
        footerButtons={[{ label: "Cerrar", color: "danger", onClick: () => setModalOpen(false) }]}
      >
        {selectedEspecie && (
          <div>
            <p><strong>ID:</strong> {selectedEspecie.id}</p>
            <p><strong>Tipo de Especie:</strong> {selectedEspecie.fk_TiposEspecie}</p>
            <p><strong>Nombre:</strong> {selectedEspecie.nombre}</p>
            <p><strong>Descripción:</strong> {selectedEspecie.descripcion}</p>
            <p><strong>Imagen:</strong> <img src={selectedEspecie.img} alt={selectedEspecie.nombre} width={100} /></p>
            <p><strong>Tiempo de Crecimiento:</strong> {selectedEspecie.tiempoCrecimiento} días</p>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
