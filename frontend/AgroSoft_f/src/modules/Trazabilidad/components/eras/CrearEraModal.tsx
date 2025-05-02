import { useState } from "react";
import { usePostEras } from "../../hooks/eras/usePostEras";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { CrearLoteModal } from "../lotes/CrearLotesModal"; // ✅ Asegúrate de tener este componente

interface CrearEraModalProps {
  onClose: () => void;
}

export const CrearEraModal = ({ onClose }: CrearEraModalProps) => {
  const [fk_lote_id, setFkLoteId] = useState<number | null>(null);
  const [tamX, setTamX] = useState<number | null>(null);
  const [tamY, setTamY] = useState<number | null>(null);
  const [posX, setPosX] = useState<number | null>(null);
  const [posY, setPosY] = useState<number | null>(null);

  const [modalLoteVisible, setModalLoteVisible] = useState(false);

  const { mutate, isPending } = usePostEras();
  const { data: lotes, isLoading: isLoadingLotes, refetch } = useGetLotes();

  const handleSubmit = () => {
    if (fk_lote_id === null || tamX === null || tamY === null || posX === null || posY === null) {
      console.error("⚠️ Error: Todos los campos son obligatorios.");
      return;
    }

    const payload = { fk_lote_id, tamX, tamY, posX, posY };

    mutate(payload, {
      onSuccess: () => {
        onClose();
        setFkLoteId(null);
        setTamX(null);
        setTamY(null);
        setPosX(null);
        setPosY(null);
      },
    });
  };

  const handleLoteCreado = (nuevoLote: { id: number }) => {
    refetch();
    setFkLoteId(nuevoLote.id);
    setModalLoteVisible(false);
  };

  return (
    <>
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
          <div className="flex items-end gap-2">
            <div className="flex-1">
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
            </div>
            <Button
              onPress={() => setModalLoteVisible(true)}
              color="success"
              radius="full"
              size="sm"
              title="Agregar nuevo lote"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

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

      {modalLoteVisible && (
        <CrearLoteModal
          onClose={() => setModalLoteVisible(false)}
          onCreate={handleLoteCreado}
        />
      )}
    </>
  );
};
