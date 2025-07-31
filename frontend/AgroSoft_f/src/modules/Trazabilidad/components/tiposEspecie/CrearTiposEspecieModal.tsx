import { useState } from "react";
import { usePostTiposEspecie } from "../../hooks/tiposEspecie/usePostTiposEspecie";
import ModalComponent from "@/components/Modal";
import { Input, Textarea } from "@heroui/react";
import { addToast } from "@heroui/toast";

interface CrearTiposEspecieModalProps {
  onClose: () => void;
  onCreate?: (nuevoTipo: { id: number }) => void;
}

export const CrearTiposEspecieModal = ({ onClose, onCreate }: CrearTiposEspecieModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { mutate, isPending } = usePostTiposEspecie();

  const handleSubmit = () => {
    if (!nombre || !descripcion) {
      addToast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos.",
        color: "danger",
      });
      return;
    }

    // ✅ Convertimos a FormData
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);

    mutate(formData, {
      onSuccess: (data) => {
        addToast({
          title: "Creación exitosa",
          description: "Nuevo tipo de especie registrado con éxito",
          color: "success",
        });

        try {
          onCreate?.(data);
        } catch (err) {
          console.error("Error en onCreate:", err);
        }

        setNombre("");
        setDescripcion("");
        onClose();
      },
      onError: (error) => {
        console.error("Error al crear el tipo de especie:", error);
        addToast({
          title: "Error al crear tipo de especie",
          description: "No fue posible registrar el tipo de especie",
          color: "danger",
        });
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Tipos de Especie"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        size="sm"
      />

      <Textarea
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        size="sm"
      />
    </ModalComponent>
  );
};
