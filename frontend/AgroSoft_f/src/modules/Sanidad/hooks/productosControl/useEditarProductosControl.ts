import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { ProductosControl } from "../../types";

export const useEditarProductosControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [productosControlEditado, setProductosControlEditado] = useState<ProductosControl | null>(null);

  const handleEditar = (productosControl: ProductosControl) => {
    setProductosControlEditado(productosControl);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    productosControlEditado,
    handleEditar,
  }; 
};
