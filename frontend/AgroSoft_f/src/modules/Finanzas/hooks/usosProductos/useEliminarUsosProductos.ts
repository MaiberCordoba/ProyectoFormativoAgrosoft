import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UsosProductos } from "../../types";

export const useEliminarUsoProducto = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [usoProductoEliminado, setUsoProductoEliminado] = useState<UsosProductos | null>(null);

  const handleEliminar = (usoProducto: UsosProductos) => {
    setUsoProductoEliminado(usoProducto);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    usoProductoEliminado,
    handleEliminar,
    handleSuccess,
  };
};
