import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchProductosControl } from "../../hooks/productosControl/usePatchProductosControl";
import { Input } from "@heroui/react";
import { ProductosControl } from "../../types";

interface EditarProductosControlModalProps {
  productoControl: ProductosControl;
  onClose: () => void;
}

const EditarProductosControlModal: React.FC<EditarProductosControlModalProps> = ({ productoControl, onClose }) => {
  const [nombre, setNombre] = useState<string>(productoControl.nombre);
  const [precio, setPresio] = useState<number>(productoControl.precio);
  const [compuestoActivo, setCompuestoActivo] = useState<string>(productoControl.compuestoActivo);
  const [fichaTecnica, setFichaTecnica] = useState<string>(productoControl.fichaTecnica);
  const [contenido, setContenido] = useState<number>(productoControl.contenido);
  const [tipoContenido, setTipoContenido] = useState<string>(productoControl.tipoContenido);
  const [unidades, setUnidades] = useState<number>(productoControl.unidades);

  const { mutate, isPending } = usePatchProductosControl();

  const handleSubmit = () => {
    mutate(
      {
        id: productoControl.id,
        data: {
          nombre,
          precio,
          compuestoActivo: compuestoActivo,
          fichaTecnica: fichaTecnica,
          contenido,
          tipoContenido: tipoContenido,
          unidades,
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
      title="Editar Producto de Control"
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
      <Input label="Precio" type="number" value={precio.toString()} onChange={(e) => setPresio(Number(e.target.value))} />
      <Input label="Compuesto Activo" type="text" value={compuestoActivo} onChange={(e) => setCompuestoActivo(e.target.value)} />
      <Input label="Ficha Técnica" type="text" value={fichaTecnica} onChange={(e) => setFichaTecnica(e.target.value)} />
      <Input label="Contenido" type="number" value={contenido.toString()} onChange={(e) => setContenido(Number(e.target.value))} />
      <Input label="Tipo de Contenido" type="text" value={tipoContenido} onChange={(e) => setTipoContenido(e.target.value)} />
      <Input label="Unidades" type="number" value={unidades.toString()} onChange={(e) => setUnidades(Number(e.target.value))} />
    </ModalComponent>
  );
};

export default EditarProductosControlModal;
