import { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { usePostTipoActividad } from "../../hooks/tipoActividad/usePostTiposActividad";
import { TipoActividad } from "../../types";

interface CrearTipoActividadModalProps {
  onClose: () => void;
  onCreate:(nuevoTipoActividad:TipoActividad) => void
}

export const CrearTipoActividadModal = ({ onClose }: CrearTipoActividadModalProps) => {
  const [nombre, setNombre] = useState("");
  const [error,setError] = useState("")

  const { mutate, isPending } = usePostTipoActividad();

  const handleSubmit = () => {
    if (!nombre) {
      setError("Por favor, completa el campo de nombre.");
      return;
    }
    setError("")

    mutate(
      { id:0, nombre },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setError("")
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
      <p className="text-red-500 text-sm mb-2">{error}</p>
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
