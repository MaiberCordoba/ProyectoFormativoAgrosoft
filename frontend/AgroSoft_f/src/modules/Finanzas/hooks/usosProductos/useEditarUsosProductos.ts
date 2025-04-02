import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UsosProductos } from "../../types";

export const useEditarUsoProducto = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [usoProductoEditado, setUsoProductoEditado] = useState<UsosProductos | null>(null);

  const handleEditar = (usoProducto: UsosProductos) => {
    setUsoProductoEditado(usoProducto);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    usoProductoEditado,
    handleEditar,
  };
};
