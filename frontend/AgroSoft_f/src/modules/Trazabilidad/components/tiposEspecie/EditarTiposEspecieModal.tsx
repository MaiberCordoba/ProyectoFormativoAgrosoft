import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchTiposEspecie } from "../../hooks/tiposEspecie/usePatchTiposEspecie";
import { TiposEspecie } from "../../types";
import { Input, Textarea } from "@heroui/react";
import { addToast } from "@heroui/toast";

interface EditarTiposEspecieModalProps {
  especie: TiposEspecie;
  onClose: () => void;
}

const EditarTiposEspecieModal: React.FC<EditarTiposEspecieModalProps> = ({ especie, onClose }) => {
  const [nombre, setNombre] = useState<string>(especie.nombre);
  const [descripcion, setDescripcion] = useState<string>(especie.descripcion);

  const { mutate, isPending } = usePatchTiposEspecie();

  const handleSubmit = () => {
    if (!nombre || !descripcion) {
      addToast({
        title: "Campos Obligatorios",
        description: "Por favor completa todos los campos antes de guardar.",
        color: "danger",
      });
      return;
    }

    const data = { nombre, descripcion };

    mutate(
      { id: especie.id, data },
      {
        onSuccess: () => {
          addToast({
            title: "Actualización exitosa",
            description: "El tipo de especie fue actualizado correctamente.",
            color: "success",
          });
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No fue posible actualizar la información.",
            color: "danger",
          });
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Tipo de Especie"
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
        value={nombre}
        label="Nombre"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        required
        size="sm"
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
        required
        size="sm"
      />
    </ModalComponent>
  );
};

export default EditarTiposEspecieModal;