import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Semilleros } from "../../types";

export const useEliminarSemilleros = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [SemillerosEliminada, setSemillerosEliminada] = useState<Semilleros | null>(null);

  const handleEliminar = (Semilleros: Semilleros) => {
    setSemillerosEliminada(Semilleros);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    SemillerosEliminada,
    handleEliminar,
    handleSuccess,
  };
};