import { useState } from "react";
import { usePostVariedad } from "../../hooks/variedad/usePostVariedad";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearVariedadModalProps {
  onClose: () => void;
  onCreate: (nuevaVariedad: { id: number; nombre: string }) => void;
}

export const CrearVariedadModal = ({ onClose, onCreate }: CrearVariedadModalProps) => {
  const [nombre, setNombre] = useState("");
  const { mutate, isPending } = usePostVariedad();

  const handleSubmit = () => {
    if (!nombre.trim()) {
      console.log("El nombre es obligatorio.");
      return;
    }

    mutate(
      { nombre },
      {
        onSuccess: (data) => {
          onCreate(data); // Notifica al padre con la nueva variedad
          onClose();      // Cierra el modal
          setNombre("");  // Limpia el formulario
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registrar Variedad"
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
        label="Nombre de la Variedad"
        placeholder="Ingresa el nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
    </ModalComponent>
  );
};
