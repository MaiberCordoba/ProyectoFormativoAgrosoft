import { useState } from "react";
import { usePostUnidadesTiempo } from "../../hooks/unidadesTiempo/usePostUnidadesTiempo";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { UnidadesTiempo } from "../../types";

interface CrearUnidadesTiempoModalProps {
  onClose: () => void;
  onCreate: (nuevaUnidadTiempo : UnidadesTiempo) => void
}


export const CrearUnidadesTiempoModal = ({
  onClose,onCreate
}: CrearUnidadesTiempoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [equivalenciaMinutos, setEquivalenciaMinutos] = useState(0);

  const { mutate, isPending } = usePostUnidadesTiempo();

  const handleSubmit = () => {
    if (!nombre  || !equivalenciaMinutos) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { id:0,nombre, equivalenciaMinutos },
      {
        onSuccess: (data) => {
          onClose();
          onCreate(data)
          setNombre("");
          setEquivalenciaMinutos(0);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de unidad de tiempo"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input label="Nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <Input label="equivalenciaMinutos" type="number" value={equivalenciaMinutos.toString()} onChange={(e) => setEquivalenciaMinutos(Number(e.target.value))} required />
    </ModalComponent>
  );
};
