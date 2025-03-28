import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchTipoAfecciones } from "../../hooks/tiposAfecciones/usePatchTipoAfecciones";
import { Input, Textarea } from "@heroui/react";
import { TiposAfecciones } from "../../types";

interface EditarTipoAfeccionesModalProps {
  tipoAfeccion: TiposAfecciones;
  onClose: () => void;
}


const EditarTipoAfeccionModal: React.FC<EditarTipoAfeccionesModalProps> = ({ tipoAfeccion, onClose }) => {
  const [nombre, setNombre] = useState<string>(tipoAfeccion.nombre);
  const [descripcion, setDescripcion] = useState<string>(tipoAfeccion.descripcion);
  const [imagen, setImagen] = useState<string>(tipoAfeccion.img);

  const { mutate, isPending } = usePatchTipoAfecciones();

  const handleSubmit = () => {
    mutate(
      {
        id: tipoAfeccion.id,
        data: {
          nombre,
          descripcion,
          
        },
      },
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
      title="Editar Tipo de Afección"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input label="Nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <Textarea label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      <Input label="Imagen" type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} />
    </ModalComponent>
  );
};

export default EditarTipoAfeccionModal;
