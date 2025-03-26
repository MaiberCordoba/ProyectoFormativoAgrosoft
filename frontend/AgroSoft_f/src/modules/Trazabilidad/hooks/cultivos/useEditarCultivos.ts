import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Cultivos } from "../../types";

export const useEditarCultivos = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [CultivosEditada, setCultivosEditada] = useState<Cultivos | null>(null);

  const handleEditar = (Cultivos: Cultivos) => {
    setCultivosEditada(Cultivos);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    CultivosEditada,
    handleEditar,
  };
};