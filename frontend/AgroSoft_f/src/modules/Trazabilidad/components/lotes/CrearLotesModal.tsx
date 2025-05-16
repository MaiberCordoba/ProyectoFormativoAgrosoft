import { useState } from "react";
import { usePostLotes } from "../../hooks/lotes/usePostLotes";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { Lotes } from "../../types";

interface CrearLoteModalProps {
  onClose: () => void;
  onCreate: (nuevoLote: Lotes) => void;
}

export const CrearLoteModal = ({ onClose, onCreate }: CrearLoteModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [latI1, setLatI1] = useState<number | null>(null);
  const [longI1, setLongI1] = useState<number | null>(null);
  const [latS1, setLatS1] = useState<number | null>(null);
  const [longS1, setLongS1] = useState<number | null>(null);
  const [latI2, setLatI2] = useState<number | null>(null);
  const [longI2, setLongI2] = useState<number | null>(null);
  const [latS2, setLatS2] = useState<number | null>(null);
  const [longS2, setLongS2] = useState<number | null>(null);
  const [estado, setEstado] = useState<string>("di"); // "di" = disponible

  const { mutate, isPending } = usePostLotes();

  const handleSubmit = () => {
    if (!nombre) {
      console.log("El nombre es obligatorio.");
      return;
    }

    mutate(
      {
        nombre,
        descripcion,
        latI1,
        longI1,
        latS1,
        longS1,
        latI2,
        longI2,
        latS2,
        longS2,
        estado: estado === "di",
      },
      {
        onSuccess: (data) => {
          onCreate(data);
          onClose();
          // reset form
          setNombre("");
          setDescripcion("");
          setLatI1(null);
          setLongI1(null);
          setLatS1(null);
          setLongS1(null);
          setLatI2(null);
          setLongI2(null);
          setLatS2(null);
          setLongS2(null);
          setEstado("di");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Lote"
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
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

<div className="grid grid-cols-2 gap-2 mt-2">
          <Input label="Lat. Inf. Izquierda" type="number" value={(latI1 ?? "").toString()} onChange={(e) => setLatI1(Number(e.target.value))} />
          <Input label="Long. Inf. Izquierda" type="number" value={(longI1 ?? "").toString()} onChange={(e) => setLongI1(Number(e.target.value))} />

          <Input label="Lat. Sup. Izquierda" type="number" value={(latS1 ?? "").toString()} onChange={(e) => setLatS1(Number(e.target.value))} />
          <Input label="Long. Sup. Izquierda" type="number" value={(longS1 ?? "").toString()} onChange={(e) => setLongS1(Number(e.target.value))} />

          <Input label="Lat. Inf. Derecha" type="number" value={(latI2 ?? "").toString()} onChange={(e) => setLatI2(Number(e.target.value))} />
          <Input label="Long. Inf. Derecha" type="number" value={(longI2 ?? "").toString()} onChange={(e) => setLongI2(Number(e.target.value))} />

          <Input label="Lat. Sup. Derecha" type="number" value={(latS2 ?? "").toString()} onChange={(e) => setLatS2(Number(e.target.value))} />
          <Input label="Long. Sup. Derecha" type="number" value={(longS2 ?? "").toString()} onChange={(e) => setLongS2(Number(e.target.value))} />
        </div>

      <Select
        label="Estado"
        placeholder="Selecciona un estado"
        selectedKeys={[estado]}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0]?.toString();
          if (selectedKey) {
            setEstado(selectedKey);
          }
        }}
      >
        <SelectItem key="di">Disponible</SelectItem>
        <SelectItem key="oc">Ocupado</SelectItem>
      </Select>
    </ModalComponent>
  );
};
