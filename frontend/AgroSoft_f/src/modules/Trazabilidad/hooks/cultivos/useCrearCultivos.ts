import { UseModal } from "@/hooks/useModal"
import { Cultivos } from "../../types";
import { useState } from "react";


export const useCrearCultivos = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [CultivosCreada, setCultivosCreada] = useState<Cultivos | null>(null);

    const handleCrear = (Cultivos: Cultivos) => {
        setCultivosCreada(Cultivos);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        CultivosCreada,
        handleCrear,
    };
};