import { useState } from "react";
import { usePostUnidadesMedida } from "../../hooks/unidadesMedida/usePostUnidadesMedida";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { UnidadesMedida } from "../../types";

interface CrearUnidadesMedidaModalProps {
  onClose: () => void;
  onCreate: (nuevaUnidadMedida : UnidadesMedida) => void
}

export const CrearUnidadesMedidaModal = ({ onClose, onCreate }: CrearUnidadesMedidaModalProps) => {
  const [nombre, setNombre] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [tipo, setTipo] = useState<"MASA" | "VOLUMEN" | "">("");
  const [equivalenciabase, setEquivalenciabase] = useState(0);

  const { mutate, isPending } = usePostUnidadesMedida();

  const handleSubmit = () => {
    if (!nombre || !abreviatura || !tipo || equivalenciabase <= 0) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { id:0,nombre, abreviatura, tipo, equivalenciabase },
      {
        onSuccess: (data) => {
          onClose();
          onCreate(data)
          setNombre("");
          setAbreviatura("");
          setTipo("");
          setEquivalenciabase(0);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de unidad de medida"
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
        label="Abreviatura"
        type="text"
        value={abreviatura}
        onChange={(e) => setAbreviatura(e.target.value)}
        required
      />
      <Select
        label="Tipo de unidad"
        value={tipo}
        onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as "MASA" | "VOLUMEN";
            setTipo(selectedKey);
          }}
        required
      >
        <SelectItem key="MASA">Masa</SelectItem>
        <SelectItem key="VOLUMEN">Volumen</SelectItem>
      </Select>
      <Input
        label="Equivalencia base"
        type="number"
        value={equivalenciabase.toString()}
        onChange={(e) => setEquivalenciabase(Number(e.target.value))}
        required
      />
    </ModalComponent>
  );
};
