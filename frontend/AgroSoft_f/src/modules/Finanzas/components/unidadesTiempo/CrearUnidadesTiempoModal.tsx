import { useState } from "react";
import { usePostUnidadesTiempo } from "../../hooks/unidadesTiempo/usePostUnidadesTiempo";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearUnidadesTiempoModalProps {
  onClose: () => void;
}


export const CrearUnidadesTiempoModal = ({
  onClose,
}: CrearUnidadesTiempoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [equivalenciabase, setEquivalenciabase] = useState(0);

  const { mutate, isPending } = usePostUnidadesTiempo();

  const handleSubmit = () => {
    if (!nombre  ||!equivalenciabase) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { nombre, equivalenciabase },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setEquivalenciabase(0);
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
      <Input label="equivalenciabase" type="number" value={equivalenciabase.toString()} onChange={(e) => setEquivalenciabase(Number(e.target.value))} required />
    </ModalComponent>
  );
};
