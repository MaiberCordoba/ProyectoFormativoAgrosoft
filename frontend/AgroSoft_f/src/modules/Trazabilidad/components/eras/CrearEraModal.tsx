import { useState } from "react";
import { usePostEras } from "../../hooks/eras/usePostEras"; // Hook para registrar eras
import { useGetLotes } from "../../hooks/lotes/useGetLotes"; // Hook para obtener lotes
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";

interface CrearEraModalProps {
  onClose: () => void;
}

export const CrearEraModal = ({ onClose }: CrearEraModalProps) => {
  const [fk_lote_id, setFkLoteId] = useState<number | null>(null);
  const [tipo, setTipo] = useState<string>("");
  const [tamX, setTamX] = useState<number | null>(null);
  const [tamY, setTamY] = useState<number | null>(null);
  const [posX, setPosX] = useState<number | null>(null);
  const [posY, setPosY] = useState<number | null>(null);

  const { mutate, isPending } = usePostEras();
  const { data: lotes, isLoading: isLoadingLotes } = useGetLotes();

  const handleSubmit = () => {
    if (fk_lote_id === null || tipo.trim() === "" || tamX === null || tamY === null || posX === null || posY === null) {
      console.error("⚠️ Error: Todos los campos son obligatorios.");
      return;
    }

    const payload = {
      fk_lote_id,
      tipo,
      tamX,
      tamY,
      posX,
      posY,
    };

    console.log("Enviando payload:", payload);

    mutate(payload, {
      onSuccess: () => {
        onClose();
        setFkLoteId(null);
        setTipo("");
        setTamX(null);
        setTamY(null);
        setPosX(null);
        setPosY(null);
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Era"
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
          selectedKeys={fk_lote_id !== null ? [fk_lote_id.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkLoteId(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(lotes ?? []).map((lote) =>
            lote?.id !== undefined ? (
              <SelectItem key={lote.id.toString()}>{lote.nombre}</SelectItem>
            ) : null
          )}
        </Select>
      )}

      <Input
        label="Tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        required
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
    </ModalComponent>
  );
};
