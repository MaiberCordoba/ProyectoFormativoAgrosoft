import { useState } from "react";
import { usePostProductosControl } from "../../hooks/productosControl/usePostProductosControl"; 
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearProductosControlModalProps {
  onClose: () => void;
}

export const CrearProductosControlModal = ({ onClose }: CrearProductosControlModalProps) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState(0);
  const [compuestoActivo, setCompuestoActivo] = useState("");
  const [fichaTecnica, setFichaTecnica] = useState("");
  const [contenido, setContenido] = useState(0);
  const [tipoContenido, setTipoContenido] = useState("");
  const [unidades, setUnidades] = useState(0);

  const { mutate, isPending } = usePostProductosControl();

  const handleSubmit = () => {
    if (!nombre || !precio || !compuestoActivo || !fichaTecnica || !contenido || !tipoContenido || !unidades) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { nombre, precio, compuestoActivo, fichaTecnica, contenido, tipoContenido, unidades },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setPrecio(0);
          setCompuestoActivo("");
          setFichaTecnica("");
          setContenido(0);
          setTipoContenido("");
          setUnidades(0);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de producto de control"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit
        },
      ]}
    >
      <Input label="Nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

      <Input label="Precio" type="number" value={precio.toString()} onChange={(e) => setPrecio(Number(e.target.value))} required />

      <Input label="Compuesto Activo" type="text" value={compuestoActivo} onChange={(e) => setCompuestoActivo(e.target.value)} required />

      <Input label="Ficha Técnica" type="text" value={fichaTecnica} onChange={(e) => setFichaTecnica(e.target.value)} required />

      <Input label="Contenido" type="number" value={contenido.toString()} onChange={(e) => setContenido(Number(e.target.value))} required />

      <Input label="Tipo de Contenido" type="text" value={tipoContenido} onChange={(e) => setTipoContenido(e.target.value)} required />

      <Input label="Unidades" type="number" value={unidades.toString()} onChange={(e) => setUnidades(Number(e.target.value))} required />
    </ModalComponent>
  );
};
