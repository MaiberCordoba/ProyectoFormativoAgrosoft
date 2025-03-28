import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { ProductosControl } from "../../types";

export const useEliminarProductosControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [productosControlEliminado, setProductosControlEliminado] = useState<ProductosControl | null>(null);

  const handleEliminar = (productosControl: ProductosControl) => {
    setProductosControlEliminado(productosControl);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    productosControlEliminado,
    handleEliminar,
    handleSuccess,
  };
};
