import { useState, useEffect } from "react";
import { usePatchVariedad } from "../../hooks/variedad/usePatchVariedad";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface EditarVariedadModalProps {
  variedad: {
    id: number;
    nombre: string;
  };
  onClose: () => void;
}

export const EditarVariedadModal = ({ variedad, onClose }: EditarVariedadModalProps) => {
  const [nombre, setNombre] = useState(variedad.nombre);
  const { mutate, isPending } = usePatchVariedad();

  useEffect(() => {
    setNombre(variedad.nombre);
  }, [variedad]);

  const handleSubmit = () => {
    if (!nombre.trim()) {
      console.log("El nombre es obligatorio.");
      return;
    }

    mutate(
      { id: variedad.id, nombre },
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
      title="Editar Variedad"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "primary",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        label="Nombre de la Variedad"
        placeholder="Ingresa el nuevo nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
    </ModalComponent>
  );
};
