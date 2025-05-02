import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Umbral } from "../../types/sensorTypes";
import { usePatchUmbral } from "../../hooks/umbral/usePachtUmbral";

interface EditarUmbralModalProps {
  umbral: Umbral;
  onClose: () => void;
}

const EditarUmbralModal: React.FC<EditarUmbralModalProps> = ({ umbral, onClose }) => {
  const [valorMinimo, setValorMinimo] = useState<number>(umbral.valor_minimo);
  const [valorMaximo, setValorMaximo] = useState<number>(umbral.valor_maximo);

  const { mutate, isPending } = usePatchUmbral();

  const handleSubmit = () => {
    if (valorMinimo >= valorMaximo) {
      addToast({
        title: "Error de validación",
        description: "El valor mínimo debe ser menor al valor máximo.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        id: umbral.id,
        data: {
          sensor_id: umbral.sensor_id,
          valor_minimo: valorMinimo,
          valor_maximo: valorMaximo,
        },
      },
      {
        onSuccess: () => {
          addToast({
            title: "Umbral actualizado",
            description: "El umbral fue actualizado correctamente.",
            color: "success",
          });
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "Ocurrió un error al actualizar el umbral.",
            color: "danger",
          });
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Umbral"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        label="Valor mínimo"
        type="number"
        value={valorMinimo.toString()}
        onChange={(e) => setValorMinimo(Number(e.target.value))}
      />
      <Input
        label="Valor máximo"
        type="number"
        value={valorMaximo.toString()}
        onChange={(e) => setValorMaximo(Number(e.target.value))}
      />
    </ModalComponent>
  );
};

export default EditarUmbralModal;
