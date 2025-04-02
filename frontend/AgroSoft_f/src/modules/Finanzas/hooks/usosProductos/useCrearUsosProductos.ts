import { UseModal } from "@/hooks/useModal";
import { UsosProductos } from "../../types";
import { useState } from "react";

export const useCrearUsosProducto = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [usoProductoCreado, setUsoProductoCreado] = useState<UsosProductos | null>(null);

    const handleCrear = (usoProducto: UsosProductos) => {
        setUsoProductoCreado(usoProducto);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        usoProductoCreado,
        handleCrear,
    };
};
