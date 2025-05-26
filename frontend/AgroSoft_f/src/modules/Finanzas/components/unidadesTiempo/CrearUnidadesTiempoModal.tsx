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
  onClose,
}: CrearUnidadesTiempoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [equivalenciaMinutos, setEquivalenciaMinutos] = useState(0);
  const [error,setError] = useState("")

  const { mutate, isPending } = usePostUnidadesTiempo();

  const handleSubmit = () => {
    if (!nombre  || !equivalenciaMinutos) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError("")
    mutate(
      { id:0,nombre, equivalenciaMinutos },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setEquivalenciaMinutos(0);
          setError("")
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
      <p className="text-red-500 text-sm mb-2">{error}</p>
      <Input label="Nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <Input label="equivalenciaMinutos" type="number" value={equivalenciaMinutos.toString()} onChange={(e) => setEquivalenciaMinutos(Number(e.target.value))} required />
    </ModalComponent>
  );
};
