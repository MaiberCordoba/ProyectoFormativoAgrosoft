import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UsoProductosControl } from "../../types";

export const useEliminarUsoProductosControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [usoproductosControlEliminado, setUsoProductosControlEliminado] = useState<UsoProductosControl | null>(null);

  const handleEliminar = (usoproductosControl: UsoProductosControl) => {
    setUsoProductosControlEliminado(usoproductosControl);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    usoproductosControlEliminado,
    handleEliminar,
    handleSuccess,
  };
};
