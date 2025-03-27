import { useState } from "react";
import { usePostLotes } from "../../hooks/lotes/usePostLotes"; // Hook para registrar lotes
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";

interface CrearLoteModalProps {
  onClose: () => void;
}

export const CrearLoteModal = ({ onClose }: CrearLoteModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tamX, setTamX] = useState<number | null>(null);
  const [tamY, setTamY] = useState<number | null>(null);
  const [posX, setPosX] = useState<number | null>(null);
  const [posY, setPosY] = useState<number | null>(null);
  const [estado, setEstado] = useState<string>("di"); // "di" por defecto

  const { mutate, isPending } = usePostLotes();

  const handleSubmit = () => {
    if (!nombre || tamX === null || tamY === null || posX === null || posY === null) {
      console.log("Por favor, completa todos los campos obligatorios.");
      return;
    }

    mutate(
      {
        nombre,
        descripcion,
        tamX,
        tamY,
        posX,
        posY,
        estado: estado === "di", // Convertir "di" a `true` y "oc" a `false`
      },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
          setTamX(null);
          setTamY(null);
          setPosX(null);
          setPosY(null);
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

      <Input
        label="Tamaño X"
        type="number"
        value={tamX !== null ? tamX.toString() : ""}
        onChange={(e) => setTamX(e.target.value === "" ? null : Number(e.target.value))}
        required
      />

      <Input
        label="Tamaño Y"
        type="number"
        value={tamY !== null ? tamY.toString() : ""}
        onChange={(e) => setTamY(e.target.value === "" ? null : Number(e.target.value))}
        required
      />

      <Input
        label="Posición X"
        type="number"
        value={posX !== null ? posX.toString() : ""}
        onChange={(e) => setPosX(e.target.value === "" ? null : Number(e.target.value))}
        required
      />

      <Input
        label="Posición Y"
        type="number"
        value={posY !== null ? posY.toString() : ""}
        onChange={(e) => setPosY(e.target.value === "" ? null : Number(e.target.value))}
        required
      />

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
