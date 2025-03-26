import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchTiposEspecie } from "../../hooks/tiposEspecie/usePatchTiposEspecie";
import { TiposEspecie } from "../../types";
import { Input, Textarea } from "@heroui/react";

interface EditarTiposEspecieModalProps {
  especie: TiposEspecie; // La especie que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarTiposEspecieModal: React.FC<EditarTiposEspecieModalProps> = ({ especie, onClose }) => {
  const [nombre, setNombre] = useState<string>(especie.nombre);
  const [descripcion, setDescripcion] = useState<string>(especie.descripcion);
  const [img, setImg] = useState<string>(especie.img); // Estado para la imagen

  const { mutate, isPending } = usePatchTiposEspecie();

  const handleSubmit = () => {
    mutate(
      {
        id: especie.id,
        data: {
          nombre,
          descripcion,
          img, // Se envía la URL de la imagen
        },
      },
      {
        onSuccess: () => {
          onClose(); // Cierra el modal después de guardar
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
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={nombre}
        label="Nombre"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        type="text"
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <Input
        value={img}
        label="Imagen (URL)"
        type="text"
        onChange={(e) => setImg(e.target.value)}
      />
    </ModalComponent>
  );
};

export default EditarTiposEspecieModal;
