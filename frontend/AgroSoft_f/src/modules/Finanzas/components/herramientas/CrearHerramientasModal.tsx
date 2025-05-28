import { useState } from "react";
import { usePostHerramienta } from "../../hooks/herramientas/usePostHerramientas";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetLotes } from "@/modules/Trazabilidad/hooks/lotes/useGetLotes";
import { Herramientas } from "../../types";
import { Lotes } from "@/modules/Trazabilidad/types";
import { Plus } from "lucide-react";
import { CrearLoteModal } from "@/modules/Trazabilidad/components/lotes/CrearLotesModal";

interface CrearHerramientasModalProps {
  onClose: () => void;
  onCreate:  (nuevaHerramienta : Herramientas) => void
}

export const CrearHerramientasModal = ({ onClose }: CrearHerramientasModalProps) => {
  const [fk_Lote, setFk_Lote] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidades, setUnidades] = useState<number | null>(null);
  const [precio, setPrecio] = useState<number | null>(null)

  const [error,setError] = useState("")

  const [lotesModal, setLotesModal] = useState(false)
  const { data: lotes, isLoading: isLoadingLotes, refetch: refetchLotes } = useGetLotes();
  const { mutate, isPending } = usePostHerramienta();

  const handleSubmit = () => {
    if (!fk_Lote || !nombre.trim() || !descripcion.trim() || !unidades || !precio) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError("")

    mutate(
      { id:0,fk_Lote, unidades, nombre, descripcion, precio },
      {
        onSuccess: () => {
          onClose();
          setFk_Lote(null);
          setUnidades(null);
          setNombre("");
          setDescripcion("");
          setPrecio(null);
          setError("")
        },
      }
    );
  };
  const handleLoteCreado = (nuevoLote : Lotes) =>{
    refetchLotes()
    setFk_Lote(nuevoLote.id)
    setLotesModal(false)
  }
  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Herramientas"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "light",
            onClick: handleSubmit,
          },
        ]}
        >
          <p className="text-red-500 text-sm mb-2">{error}</p>
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
          required
        />

        <Input
          label="Cantidad"
          type="number"
          value={unidades}
          onChange={(e) => setUnidades(e.target.value ? Number(e.target.value) : 0)}
          required
        />

        <Input
          label="Precio unidad"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value ? Number(e.target.value) : 0)}
          required
        />

        {/* Selector de Lotes */}
        {isLoadingLotes ? (
          <p>Cargando Lotes...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
              label="Lote"
              placeholder="Selecciona un Lote"
                selectedKeys={fk_Lote?.toString() ? [fk_Lote.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Lote(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(lotes || []).map((lote) => (
                  <SelectItem key={lote.id.toString()}>
                    {lote.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
            onPress={()=> setLotesModal(true)}
            color="success"
            title="Crear Lote"
            size="sm"
            >
                <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
      </ModalComponent>
      {lotesModal && (
        <CrearLoteModal
        onClose={()=>setLotesModal(false)}
        onCreate={handleLoteCreado}
        />
      )}
    </>
  );
};
