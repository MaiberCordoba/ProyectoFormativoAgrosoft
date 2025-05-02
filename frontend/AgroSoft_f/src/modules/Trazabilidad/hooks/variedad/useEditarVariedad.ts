import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Variedad } from "../../types";

export const useEditarVariedad = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [VariedadEditada, setVariedadEditada] = useState<Variedad | null>(null);

  const handleEditar = (Variedad: Variedad) => {
    setVariedadEditada(Variedad);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    VariedadEditada,
    handleEditar,
  };
};