import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Variedad } from "../../types";

export const useEliminarVariedad = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [VariedadEliminada, setVariedadEliminada] = useState<Variedad | null>(null);

  const handleEliminar = (Variedad: Variedad) => {
    setVariedadEliminada(Variedad);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    VariedadEliminada,
    handleEliminar,
    handleSuccess,
  };
};