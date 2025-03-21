import { useState } from "react";
import { useLotes } from "../hooks/useHooks";
import TableComponent from "@/components/Table";
import ModalComponent from "@/components/Modal";
import { Lotes } from "@/modules/Trazabilidad/types";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

export function LoteList() {
  const { data: lotes, isLoading, error } = useLotes();
  const [selectedLote, setSelectedLote] = useState<Lotes | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los lotes</p>;

  const handleDetailsClick = (lote: Lotes) => {
    setSelectedLote(lote);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link to="/crearLote">
          <Button color="success" size="md">Crear Lote</Button>
        </Link>
      </div>
      <br />
      <h1 className="text-xl font-bold mb-4">Lista de Lotes</h1>
      <br />
      {(!lotes || lotes.length === 0) ? (
        <p>No se encontraron lotes.</p>
      ) : (
        <TableComponent<Lotes>
          columns={[
            { key: "id", label: "ID" },
            { key: "nombre", label: "Nombre" },
            { key: "descripcion", label: "Descripción" },
            { key: "tamX", label: "Tamaño X" },
            { key: "tamY", label: "Tamaño Y" },
            { key: "estado", label: "Estado" },
            { key: "posX", label: "Posición X" },
            { key: "posY", label: "Posición Y" },
            { key: "acciones", label: "Acciones" }
          ]}
          data={lotes}
          renderActions={(lote) => (
            <div className="flex gap-2">
              <Button color="primary" size="sm" onClick={() => handleDetailsClick(lote)}>
                Detalles
              </Button>
              <Link to={`/editarLote/${lote.id}`}>
                <Button color="warning" size="sm">Editar</Button>
              </Link>
            </div>
          )}
        />
      )}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalles del Lote"
        footerButtons={[{ label: "Cerrar", color: "danger", onClick: () => setModalOpen(false) }]}
      >
        {selectedLote && (
          <div>
            <p><strong>ID:</strong> {selectedLote.id}</p>
            <p><strong>Nombre:</strong> {selectedLote.nombre}</p>
            <p><strong>Descripción:</strong> {selectedLote.descripcion}</p>
            <p><strong>Tamaño X:</strong> {selectedLote.tamX}</p>
            <p><strong>Tamaño Y:</strong> {selectedLote.tamY}</p>
            <p><strong>Estado:</strong> {selectedLote.estado ? "Activo" : "Inactivo"}</p>
            <p><strong>Posición X:</strong> {selectedLote.posX}</p>
            <p><strong>Posición Y:</strong> {selectedLote.posY}</p>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
