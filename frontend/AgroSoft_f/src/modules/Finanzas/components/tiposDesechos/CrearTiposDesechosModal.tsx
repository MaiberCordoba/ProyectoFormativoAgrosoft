import { useState } from "react";
import { usePostTiposDesechos } from "../../hooks/tiposDesechos/usePostTiposDesechos";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearTiposDesechosModalProps {
  onClose: () => void;
}

export const CrearTiposDesechosModal = ({ onClose }: CrearTiposDesechosModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { mutate, isPending } = usePostTiposDesechos();

  const handleSubmit = () => {
    if (!nombre || !descripcion) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      {nombre, descripcion }, // Envía el ID del tipo de plaga
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
      title="Registro de tipo de desecho"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant:"light",
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