import { UseModal } from "@/hooks/useModal"
import { SensorData } from "../../types/sensorTypes";
import { useState } from "react";


export const useCrearSensor = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [sensorCreado, setSensorCreado] = useState<SensorData | null>(null);

    const handleCrear = (sensor: SensorData) => {
        setSensorCreado(sensor);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        sensorCreado,
        handleCrear,
    };
};