import React, { useState } from "react";
import { usePatchSensor } from "../../hooks/sensor/usePachtSensor";
import { SensorData } from "../../types/sensorTypes";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface EditarSensorModalProps {
  sensor: SensorData;
  onClose: () => void;
}

const EditarSensorModal: React.FC<EditarSensorModalProps> = ({ sensor, onClose }) => {
  const [umbral_minimo, setUmbralMinimo] = useState<number | null>(sensor.umbral_minimo ?? null);
  const [umbral_maximo, setUmbralMaximo] = useState<number | null>(sensor.umbral_maximo ?? null);

  const { mutate, isPending } = usePatchSensor();

  const handleSubmit = () => {
    mutate(
      {
        id: sensor.id,
        data: {
          umbral_minimo,
          umbral_maximo,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Sensor"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Umbral Mínimo</label>
          <Input
            type="number"
            value={umbral_minimo ?? ""}
            onChange={(e) => setUmbralMinimo(Number(e.target.value))}
            placeholder="Ingrese el umbral mínimo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Umbral Máximo</label>
          <Input
            type="number"
            value={umbral_maximo ?? ""}
            onChange={(e) => setUmbralMaximo(Number(e.target.value))}
            placeholder="Ingrese el umbral máximo"
          />
        </div>
      </div>
    </ModalComponent>
  );
};

export default EditarSensorModal;
