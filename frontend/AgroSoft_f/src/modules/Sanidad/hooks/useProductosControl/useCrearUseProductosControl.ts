import { UseModal } from "@/hooks/useModal";
import { UsoProductosControl} from "../../types";
import { useState } from "react";

export const useCrearUsoProductosControl = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [usoproductosControlCreado, setUsoProductosControlCreado] = useState<UsoProductosControl | null>(null);

    const handleCrear = (usoproductosControl: UsoProductosControl) => {
        setUsoProductosControlCreado(usoproductosControl);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        usoproductosControlCreado,
        handleCrear,
    };
};
