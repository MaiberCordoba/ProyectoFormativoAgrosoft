import { useState } from "react";
import { usePostEras } from "../../hooks/eras/usePostEras";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { CrearLoteModal } from "../lotes/CrearLotesModal";

interface CrearEraModalProps {
  onClose: () => void;
}

export const CrearEraModal = ({ onClose }: CrearEraModalProps) => {
  const [fk_lote, setFkLoteId] = useState<number | null>(null);
  const [tipo, setTipo] = useState("");

  const [latI1, setLatI1] = useState<number | null>(null);
  const [longI1, setLongI1] = useState<number | null>(null);
  const [latS1, setLatS1] = useState<number | null>(null);
  const [longS1, setLongS1] = useState<number | null>(null);
  const [latI2, setLatI2] = useState<number | null>(null);
  const [longI2, setLongI2] = useState<number | null>(null);
  const [latS2, setLatS2] = useState<number | null>(null);
  const [longS2, setLongS2] = useState<number | null>(null);

  const [modalLoteVisible, setModalLoteVisible] = useState(false);

  const { mutate, isPending } = usePostEras();
  const { data: lotes, isLoading: isLoadingLotes, refetch } = useGetLotes();

  const handleSubmit = () => {
    if (
      fk_lote === null ||
      tipo.trim() === "" ||
      latI1 === null || longI1 === null ||
      latS1 === null || longS1 === null ||
      latI2 === null || longI2 === null ||
      latS2 === null || longS2 === null
    ) {
      console.error("⚠️ Error: Todos los campos son obligatorios.");
      return;
    }

    const payload = {
      fk_lote,
      tipo,
      latI1,
      longI1,
      latS1,
      longS1,
      latI2,
      longI2,
      latS2,
      longS2
    };

    mutate(payload, {
      onSuccess: () => {
        onClose();
        setFkLoteId(null);
        setTipo("");
        setLatI1(null); setLongI1(null);
        setLatS1(null); setLongS1(null);
        setLatI2(null); setLongI2(null);
        setLatS2(null); setLongS2(null);
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
                selectedKeys={fk_lote !== null ? [fk_lote.toString()] : []}
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

        <Input label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} required />

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input label="Lat. Inf. Izquierda" type="number" value={latI1 ?? ""} onChange={(e) => setLatI1(Number(e.target.value))} />
          <Input label="Long. Inf. Izquierda" type="number" value={longI1 ?? ""} onChange={(e) => setLongI1(Number(e.target.value))} />

          <Input label="Lat. Sup. Izquierda" type="number" value={latS1 ?? ""} onChange={(e) => setLatS1(Number(e.target.value))} />
          <Input label="Long. Sup. Izquierda" type="number" value={longS1 ?? ""} onChange={(e) => setLongS1(Number(e.target.value))} />

          <Input label="Lat. Inf. Derecha" type="number" value={latI2 ?? ""} onChange={(e) => setLatI2(Number(e.target.value))} />
          <Input label="Long. Inf. Derecha" type="number" value={longI2 ?? ""} onChange={(e) => setLongI2(Number(e.target.value))} />

          <Input label="Lat. Sup. Derecha" type="number" value={latS2 ?? ""} onChange={(e) => setLatS2(Number(e.target.value))} />
          <Input label="Long. Sup. Derecha" type="number" value={longS2 ?? ""} onChange={(e) => setLongS2(Number(e.target.value))} />
        </div>
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
