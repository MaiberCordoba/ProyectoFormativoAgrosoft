import { useState } from "react";
import { usePostTipoControl } from "../../hooks/tipoControl/usePostTipoControl";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearTipoControlModalProps {
  onClose: () => void;
}

export const CrearTipoControlModal = ({ onClose }: CrearTipoControlModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  

  const { mutate, isPending } = usePostTipoControl();

  const handleSubmit = () => {
    if (!nombre || !descripcion) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { nombre, descripcion},
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
          
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de tipo de control"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit
        },
      ]}
    >
      <Input
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />

    </ModalComponent>
  );
};
