import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Umbral } from "../../types/sensorTypes";

export const useEliminarUmbral = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [umbralEliminado, setUmbralEliminado] = useState<Umbral | null>(null);

  const handleEliminar = (umbral: Umbral) => {
    setUmbralEliminado(umbral);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    umbralEliminado,
    handleEliminar,
    handleSuccess,
  };
};
