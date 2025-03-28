import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchEras } from "../../hooks/eras/usePatchEras";
import { Eras } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";

interface EditarEraModalProps {
  era: Eras;
  onClose: () => void;
}

const EditarEraModal: React.FC<EditarEraModalProps> = ({ era, onClose }) => {
  const [fk_lote_id, setFkLoteId] = useState<number | null>(era.fk_lote_id ?? null);
  const [tipo, setTipo] = useState<string>(era.tipo ?? "");
  const [tamX, setTamX] = useState<number>(era.tamX ?? 0);
  const [tamY, setTamY] = useState<number>(era.tamY ?? 0);
  const [posX, setPosX] = useState<number>(era.posX ?? 0);
  const [posY, setPosY] = useState<number>(era.posY ?? 0);

  const { mutate, isPending } = usePatchEras();
  const { data: lotes, isLoading: isLoadingLotes } = useGetLotes();

  const handleSubmit = () => {
    if (fk_lote_id === null || tipo.trim() === "" || tamX === null || tamY === null || posX === null || posY === null) {
      console.error("⚠️ Error: Todos los campos son obligatorios.");
      return;
    }

    mutate(
      {
        id: era.id ?? 0,
        data: {
          fk_lote_id,
          tipo,
          tamX,
          tamY,
          posX,
          posY,
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
      title="Editar Era"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {isLoadingLotes ? (
        <p>Cargando lotes...</p>
      ) : (
        <Select
          label="Lote"
          placeholder="Selecciona un lote"
          selectedKeys={fk_lote_id ? [fk_lote_id.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkLoteId(Number(selectedKey) || null);
          }}
        >
          {(lotes || []).map((lote) => (
            <SelectItem key={lote.id?.toString()}>{lote.nombre}</SelectItem>
          ))}
        </Select>
      )}

      <Input
        label="Tipo"
        type="text"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        required
      />

      <Input
        label="Tamaño X"
        type="number"
        value={tamX !== null ? tamX.toString() : ""}
        onChange={(e) => setTamX(Number(e.target.value) || 0)}
        required
      />

      <Input
        label="Tamaño Y"
        type="number"
        value={tamY !== null ? tamY.toString() : ""}
        onChange={(e) => setTamY(Number(e.target.value) || 0)}
        required
      />

      <Input
        label="Posición X"
        type="number"
        value={posX !== null ? posX.toString() : ""}
        onChange={(e) => setPosX(Number(e.target.value) || 0)}
        required
      />

      <Input
        label="Posición Y"
        type="number"
        value={posY !== null ? posY.toString() : ""}
        onChange={(e) => setPosY(Number(e.target.value) || 0)}
        required
      />
    </ModalComponent>
  );
};

export default EditarEraModal;
