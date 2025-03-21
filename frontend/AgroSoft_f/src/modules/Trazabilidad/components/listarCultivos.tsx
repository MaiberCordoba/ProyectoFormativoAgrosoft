import { useState } from "react"; 
import { useCultivos } from "../hooks/useCultivo";
import TableComponent from "@/components/Table";
import ModalComponent from "@/components/Modal";
import { Cultivos } from "@/modules/Trazabilidad/types";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

export function CultivoList() {
  const { data: cultivos, isLoading, error } = useCultivos();
  const [selectedCultivo, setSelectedCultivo] = useState<Cultivos | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los cultivos</p>;

  const handleDetailsClick = (cultivo: Cultivos) => {
    setSelectedCultivo(cultivo);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Botón para crear cultivo SIEMPRE visible */}
      <div className="mb-4">
        <Link to="/crearCultivos">
          <Button color="success" size="md">Crear Cultivo</Button>
        </Link>
      </div>
<br />
      <h1 className="text-xl font-bold mb-4">Lista de Cultivos</h1>
<br />
      {/* Mensaje si no hay cultivos */}
      {(!cultivos || cultivos.length === 0) ? (
        <p>No se encontraron cultivos.</p>
      ) : (
        <TableComponent<Cultivos>
          columns={[
            { key: "id", label: "ID" },
            { key: "fk_Especie", label: "Especie" },
            { key: "nombre", label: "Nombre" },
            { key: "unidades", label: "Unidades" },
            { key: "activo", label: "Activo" },
            { key: "fechaSiembra", label: "Fecha de Siembra" },
            { key: "acciones", label: "Acciones" },
          ]}
          data={cultivos}
          renderActions={(cultivo) => (
            <div className="flex gap-2">
              <Button color="primary" size="sm" onClick={() => handleDetailsClick(cultivo)}>
                Detalles
              </Button>
              <Link to={`/editarCultivo/${cultivo.id}`}>
                <Button color="warning" size="sm">Editar</Button>
              </Link>
            </div>
          )}
        />
      )}

      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalles del Cultivo"
        footerButtons={[{ label: "Cerrar", color: "danger", onClick: () => setModalOpen(false) }]}
      >
        {selectedCultivo && (
          <div>
            <p><strong>ID:</strong> {selectedCultivo.id}</p>
            <p><strong>Especie:</strong> {selectedCultivo.fk_Especie}</p>
            <p><strong>Nombre:</strong> {selectedCultivo.nombre}</p>
            <p><strong>Unidades:</strong> {selectedCultivo.unidades}</p>
            <p><strong>Activo:</strong> {selectedCultivo.activo ? "Sí" : "No"}</p>
            <p><strong>Fecha de Siembra:</strong> {selectedCultivo.fechaSiembra}</p>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
