import { UseModal } from "@/hooks/useModal"
import { Variedad } from "../../types";
import { useState } from "react";


export const useCrearVariedad = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [VariedadCreada, setVariedadCreada] = useState<Variedad | null>(null);

    const handleCrear = (Variedad: Variedad) => {
        setVariedadCreada(Variedad);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        VariedadCreada,
        handleCrear,
    };
};