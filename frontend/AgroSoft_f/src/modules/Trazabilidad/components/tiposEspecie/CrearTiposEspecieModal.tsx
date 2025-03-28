import { useState } from "react";
import { usePostTiposEspecie } from "../../hooks/tiposEspecie/usePostTiposEspecie";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearTiposEspecieModalProps {
  onClose: () => void;
}

export const CrearTiposEspecieModal = ({ onClose }: CrearTiposEspecieModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [img, setImg] = useState("");

  const { mutate, isPending } = usePostTiposEspecie();

  const handleSubmit = () => {
    if (!nombre || !descripcion || !img) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { nombre, descripcion, img },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
          setImg("");
        },
      }
    );
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
          variant: "light",
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
      />

      <Input
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />

      <Input
        label="Imagen"
        type="text"
        value={img}
        onChange={(e) => setImg(e.target.value)}
        required
      />
    </ModalComponent>
  );
};
