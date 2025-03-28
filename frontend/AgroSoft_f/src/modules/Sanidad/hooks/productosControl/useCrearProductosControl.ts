import { UseModal } from "@/hooks/useModal";
import { ProductosControl } from "../../types";
import { useState } from "react";

export const useCrearProductosControl = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [productosControlCreado, setProductosControlCreado] = useState<ProductosControl | null>(null);

    const handleCrear = (productosControl: ProductosControl) => {
        setProductosControlCreado(productosControl);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        productosControlCreado,
        handleCrear,
    };
};
