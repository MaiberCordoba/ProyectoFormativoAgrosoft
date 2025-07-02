import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Ventas } from "../../types";

export const useCrearVenta = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [ventaCreada, setVentaCreada] = useState<Ventas | null>(null);

  const handleCrear = () => {
    setVentaCreada(null);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    ventaCreada,
    handleCrear,
  };
};