import { useState } from "react";
import { usePostVariedad } from "../../hooks/variedad/usePostVariedad";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearVariedadModalProps {
  onClose: () => void;
  onCreate: (nuevoTipo: { id: number }) => void;
}

export const CrearVariedadModal = ({ onClose, onCreate }: CrearVariedadModalProps) => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = usePostVariedad();

  const handleSubmit = () => {
    const trimmedNombre = nombre.trim();

    if (!trimmedNombre) {
      setError("Por favor, completa el nombre.");
      return;
    }

    setError("");

    mutate({ nombre: trimmedNombre }, {
      onSuccess: (data) => {
        onCreate(data);
        onClose();
        setNombre("");
      },
      onError: () => {
        setError("Ocurrió un error al guardar la variedad.");
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Variedad"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
          disabled: isPending,
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
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </ModalComponent>
  );
};
