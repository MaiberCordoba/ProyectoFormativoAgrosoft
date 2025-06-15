import { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { usePostTipoActividad } from "../../hooks/tipoActividad/usePostTiposActividad";
import { TipoActividad } from "../../types";
import { addToast } from "@heroui/toast";
import { useGetTipoActividad } from "../../hooks/tipoActividad/useGetTiposActividad";

interface CrearTipoActividadModalProps {
  onClose: () => void;
  onCreate: (nuevoTipoActividad: TipoActividad) => void
}

export const CrearTipoActividadModal = ({ onClose }: CrearTipoActividadModalProps) => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("")

  const { mutate, isPending } = usePostTipoActividad();
  const { data: tipoActividad } = useGetTipoActividad()

  const handleSubmit = () => {
    if (!nombre.trim()) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        color: "danger",
      });
      return;
    }

    const nombreExiste = tipoActividad?.some(
      (a) => a.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
    );

    if (nombreExiste) {
      addToast({
        title: "Valores duplicados",
        description: "El nombre de ese tipo de actividad ya existe.",
        color: "danger",
      });
      return;
    }

    setError("");

    mutate(
      { id: 0, nombre },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setError("");
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
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>
      <Input
        label="Nombre del Tipo de Actividad"
        type="text"
        size="sm"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
    </ModalComponent>
  );
};
