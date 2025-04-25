import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteUmbral } from "../../hooks/umbral/useDeleteUmbral";
import { Umbral } from "../../types/sensorTypes";
import { AlertCircle } from "lucide-react";

interface EliminarUmbralModalProps {
  umbral: Umbral;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarUmbralModal: React.FC<EliminarUmbralModalProps> = ({
  umbral,
  isOpen,
  onClose,
}) => {
  const { mutate, isPending } = useDeleteUmbral();

  const handleConfirmDelete = () => {
    mutate(
      { id: umbral.id },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footerButtons={[
        {
          label: isPending ? "Eliminando..." : "Eliminar",
          color: "danger",
          variant: "light",
          onClick: handleConfirmDelete,
        },
      ]}
    >
      <div className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 p-3 bg-red-50 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¿Eliminar el umbral del sensor con ID "{umbral.sensor_id}"?
        </h3>

        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente el umbral del sistema.
          ¿Estás segura de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarUmbralModal;
