import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Semilleros } from "../../types";

export const useEditarSemilleros = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [SemillerosEditada, setSemillerosEditada] = useState<Semilleros | null>(null);

  const handleEditar = (Semilleros: Semilleros) => {
    setSemillerosEditada(Semilleros);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    SemillerosEditada,
    handleEditar,
  };
};