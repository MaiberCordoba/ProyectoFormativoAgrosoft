import ModalComponent from "@/components/Modal";
import { Cosechas } from "../types";

interface CosechasModalProps {
  isOpen: boolean;
  onClose: () => void;
  cosechas: Cosechas | null;
}

export default function DetallesCosechas({ isOpen, onClose, cosechas }: CosechasModalProps) {
  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Afección"
      
    >
      {cosechas && (
        <div>
          <p><strong>ID:</strong> {cosechas.id}</p>
          <p><strong>FK_CULTIVO:</strong> {cosechas.fk_Cultivo}</p>
          <p><strong>UNIDADES:</strong> {cosechas.unidades}</p>
          <p><strong>FECHA:</strong> {cosechas.fecha}</p>
        </div>
      )}
    </ModalComponent>
  );
}