import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Cultivos } from "../../types";

export const useEliminarCultivos = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [CultivosEliminada, setCultivosEliminada] = useState<Cultivos | null>(null);

  const handleEliminar = (Cultivos: Cultivos) => {
    setCultivosEliminada(Cultivos);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    CultivosEliminada,
    handleEliminar,
    handleSuccess,
  };
};