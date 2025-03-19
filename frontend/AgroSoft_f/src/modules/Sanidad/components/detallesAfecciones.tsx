import ModalComponent from "@/components/Modal";
import { Afecciones } from "../types";

interface AfeccionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  afeccion: Afecciones | null;
}

export default function DetallesAfecciones({ isOpen, onClose, afeccion }: AfeccionesModalProps) {
  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Afección"
      
    >
      {afeccion && (
        <div>
          <p><strong>ID:</strong> {afeccion.id}</p>
          <p><strong>Nombre:</strong> {afeccion.nombre}</p>
          <p><strong>Descripción:</strong> {afeccion.descripcion}</p>
        </div>
      )}
    </ModalComponent>
  );
}
