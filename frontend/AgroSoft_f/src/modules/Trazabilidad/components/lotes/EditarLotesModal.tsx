import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchLotes } from "../../hooks/lotes/usePatchLotes";
import { Lotes } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";

interface EditarLoteModalProps {
  lote: Lotes;
  onClose: () => void;
}

const EditarLoteModal: React.FC<EditarLoteModalProps> = ({ lote, onClose }) => {
  const [nombre, setNombre] = useState<string>(lote.nombre ?? "");
  const [descripcion, setDescripcion] = useState<string>(lote.descripcion ?? "");
  const [latI1, setLatI1] = useState<number | null>(lote.latI1);
  const [longI1, setLongI1] = useState<number | null>(lote.longI1);
  const [latS1, setLatS1] = useState<number | null>(lote.latS1);
  const [longS1, setLongS1] = useState<number | null>(lote.longS1);
  const [latI2, setLatI2] = useState<number | null>(lote.latI2);
  const [longI2, setLongI2] = useState<number | null>(lote.longI2);
  const [latS2, setLatS2] = useState<number | null>(lote.latS2);
  const [longS2, setLongS2] = useState<number | null>(lote.longS2);  
  const [estado, setEstado] = useState<string>(lote.estado ? "di" : "oc");

  const { mutate, isPending } = usePatchLotes();

  const handleSubmit = () => {
    mutate(
      {
        id: lote.id ?? 0,
        data: {
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
      title="Editar Lote"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <Input label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <Input label="Latitud I1" type="number" value={latI1.toString()} onChange={(e) => setLatI1(Number(e.target.value))} required />
      <Input label="Longitud I1" type="number" value={longI1.toString()} onChange={(e) => setLongI1(Number(e.target.value))} required />
      <Input label="Latitud S1" type="number" value={latS1.toString()} onChange={(e) => setLatS1(Number(e.target.value))} required />
      <Input label="Longitud S1" type="number" value={longS1.toString()} onChange={(e) => setLongS1(Number(e.target.value))} required />

      <Input label="Latitud I2" type="number" value={latI2.toString()} onChange={(e) => setLatI2(Number(e.target.value))} required />
      <Input label="Longitud I2" type="number" value={longI2.toString()} onChange={(e) => setLongI2(Number(e.target.value))} required />
      <Input label="Latitud S2" type="number" value={latS2.toString()} onChange={(e) => setLatS2(Number(e.target.value))} required />
      <Input label="Longitud S2" type="number" value={longS2.toString()} onChange={(e) => setLongS2(Number(e.target.value))} required />

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

export default EditarLoteModal;
