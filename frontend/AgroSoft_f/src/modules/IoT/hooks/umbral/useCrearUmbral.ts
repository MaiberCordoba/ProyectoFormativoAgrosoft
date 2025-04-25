import { UseModal } from "@/hooks/useModal";
import { Umbral } from "../../types/sensorTypes";
import { useState } from "react";

export const useCrearUmbral = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [umbralCreado, setUmbralCreado] = useState<Umbral | null>(null);

  const handleCrear = (umbral: Umbral) => {
    setUmbralCreado(umbral);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    umbralCreado,
    handleCrear,
  };
};
