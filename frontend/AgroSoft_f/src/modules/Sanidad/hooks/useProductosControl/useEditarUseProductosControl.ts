import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UsoProductosControl } from "../../types";

export const useEditarUsoProductosControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [usoproductosControlEditado, setUsoProductosControlEditado] = useState<UsoProductosControl | null>(null);

  const handleEditar = (usoproductosControl: UsoProductosControl) => {
    setUsoProductosControlEditado(usoproductosControl);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    usoproductosControlEditado,
    handleEditar,
  }; 
};
