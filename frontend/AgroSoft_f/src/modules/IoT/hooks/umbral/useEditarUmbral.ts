import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Umbral } from "../../types/sensorTypes";

export const useEditarUmbral = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [itemEditado, setItemEditado] = useState<Umbral | null>(null);

  const handleEditar = (umbral: Umbral) => {
    setItemEditado(umbral);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    itemEditado,
    handleEditar,
  };
};

