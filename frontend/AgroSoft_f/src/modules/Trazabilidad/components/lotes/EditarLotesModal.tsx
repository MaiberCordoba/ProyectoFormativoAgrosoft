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
  const [tamX, setTamX] = useState<number>(lote.tamX ?? 0);
  const [tamY, setTamY] = useState<number>(lote.tamY ?? 0);
  const [posX, setPosX] = useState<number>(lote.posX ?? 0);
  const [posY, setPosY] = useState<number>(lote.posY ?? 0);
  const [estado, setEstado] = useState<string>(lote.estado ? "di" : "oc"); // Convertir booleano a string

  const { mutate, isPending } = usePatchLotes();

  const handleSubmit = () => {
    mutate(
      {
        id: lote.id ?? 0,
        data: {
          nombre,
          descripcion,
          tamX,
          tamY,
          posX,
          posY,
          estado: estado === "di", // Convertir "di" a `true` y "oc" a `false`
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
      <Input label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      <Input label="Tamaño X" type="number" value={tamX.toString()} onChange={(e) => setTamX(Number(e.target.value) || 0)} required />
      <Input label="Tamaño Y" type="number" value={tamY.toString()} onChange={(e) => setTamY(Number(e.target.value) || 0)} required />
      <Input label="Posición X" type="number" value={posX.toString()} onChange={(e) => setPosX(Number(e.target.value) || 0)} required />
      <Input label="Posición Y" type="number" value={posY.toString()} onChange={(e) => setPosY(Number(e.target.value) || 0)} required />

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
