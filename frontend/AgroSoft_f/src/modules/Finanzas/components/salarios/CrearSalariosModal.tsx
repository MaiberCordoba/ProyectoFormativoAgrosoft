import { useState } from "react";
import { usePostSalario } from "../../hooks/salarios/usePostSalarios";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { Salarios } from "../../types";

interface CrearSalariosModalProps {
  onClose: () => void;
  onCreate: (nuevoSalario : Salarios) => void
}

export const CrearSalariosModal = ({ onClose}: CrearSalariosModalProps) => {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState<number | "">("");
  const [horas, setHoras] = useState<number | "">("");
  const [estado, setEstado] = useState<"activo" | "inactivo" | "">("");

  const { mutate, isPending } = usePostSalario();

  const handleSubmit = () => {
    if (!nombre || monto === "" || horas === "" || !estado) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        id:0,
        nombre,
        monto: Number(monto),
        horas: Number(horas),
        estado,
      },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setMonto("");
          setHoras("");
          setEstado("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Salarios"
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
        label="Nombre Salario"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        label="Monto(valor)"
        type="number"
        value={monto}
        onChange={(e) => setMonto(Number(e.target.value))}
        required
      />

      <Input
        label="Horas de trabajo(dia)"
        type="number"
        value={horas}
        onChange={(e) => setHoras(Number(e.target.value))}
        required
      />

      <Select
        label="Estado"
        value={estado}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as "activo" | "inactivo";
          setEstado(selectedKey);
        }}
        required
      >
        <SelectItem key="activo">Activo</SelectItem>
        <SelectItem key="inactivo">Inactivo</SelectItem>
      </Select>
    </ModalComponent>
  );
};
