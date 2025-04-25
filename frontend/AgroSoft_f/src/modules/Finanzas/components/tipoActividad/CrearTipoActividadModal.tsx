import { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { usePostTipoActividad } from "../../hooks/tipoActividad/usePostTiposActividad";

interface CrearTipoActividadModalProps {
  onClose: () => void;
}

export const CrearTipoActividadModal = ({ onClose }: CrearTipoActividadModalProps) => {
  const [nombre, setNombre] = useState("");
  const { mutate, isPending } = usePostTipoActividad();

  const handleSubmit = () => {
    if (!nombre) {
      console.log("Por favor, completa el campo de nombre.");
      return;
    }

    mutate(
      { nombre },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Tipo de Actividad"
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
        label="Nombre del Tipo de Actividad"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
    </ModalComponent>
  );
};
