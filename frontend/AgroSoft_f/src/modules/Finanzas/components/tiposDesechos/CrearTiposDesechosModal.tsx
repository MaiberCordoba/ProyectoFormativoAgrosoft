import { useState } from "react";
import { usePostTiposDesechos } from "../../hooks/tiposDesechos/usePostTiposDesechos";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { TiposDesechos } from "../../types";

interface CrearTiposDesechosModalProps {
  onClose: () => void;
  onCreate: (nuevoTipoDesecho : TiposDesechos) => void
}

export const CrearTiposDesechosModal = ({ onClose,onCreate }: CrearTiposDesechosModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { mutate, isPending } = usePostTiposDesechos();

  const handleSubmit = () => {
    if (!nombre || !descripcion) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      {id:0 ,nombre, descripcion }, // Envía el ID del tipo de plaga
      {
        onSuccess: (data) => {
          onClose();
          onCreate(data)
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