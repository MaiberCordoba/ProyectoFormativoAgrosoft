import { UseModal } from "@/hooks/useModal"
import { useState } from "react";
import { Semillero } from "../../types";


export const useCrearSemilleros = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [SemillerosCreada, setSemillerosCreada] = useState<Semillero | null>(null);

    const handleCrear = (Semilleros: Semillero) => {
        setSemillerosCreada(Semilleros);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        SemillerosCreada,
        handleCrear,
    };
};