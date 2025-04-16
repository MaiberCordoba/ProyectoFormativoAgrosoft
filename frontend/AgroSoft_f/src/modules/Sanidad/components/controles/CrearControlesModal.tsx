import { useState } from "react";
import { postControles} from "../../hooks/controles/usePostControles";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem,  } from "@heroui/react";
import { useGetAfeccionesCultivo } from "../../hooks/afeccionescultivo/useGetAfeccionescultivo";
import { useGetTipoControl } from "../../hooks/tipoControl/useGetTipoControl";
import { Plus } from "lucide-react";
import { TipoControl } from "../../types";
import { CrearTipoControlModal } from "../tipocontrol/CrearTipoControlModal";

interface CrearControlModalProps {
  onClose: () => void;
}

export const CrearControlModal = ({ onClose }: CrearControlModalProps) => {
  const [fechaControl, setFechaControl] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fk_Afeccion, setFk_Afeccion] = useState<number | null>(null);
  const [fk_TipoControl, setFk_TipoControl] = useState<number | null>(null);

  const { data: afecciones, isLoading: isLoadingAfecciones } = useGetAfeccionesCultivo();
  const { data: tiposControl, isLoading: isLoadingTiposControl, refetch: refetchTipoControl } = useGetTipoControl();
  const { mutate, isPending } = postControles();

  //estado para manejar (abrir/cerrar) modal interno 
  const [mostrarModalTiposControl, setMostrarModalTiposControl] = useState(false)

  const handleSubmit = () => {
    if (!fechaControl || !descripcion || !fk_Afeccion || !fk_TipoControl) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { id:0 ,fechaControl , descripcion, fk_Afeccion, fk_TipoControl }, 
      {
        onSuccess: () => {
          onClose();
          setFechaControl("");
          setDescripcion("");
          setFk_Afeccion(null);
          setFk_TipoControl(null);
        },
      }
    );
  };

  const handleTipoControlCreado = (nuevoTipo:TipoControl) => {
    refetchTipoControl(); // actualiza el select con la nueva info
    setFk_TipoControl(nuevoTipo.id); // selecciona el nuevo tipo
    setMostrarModalTiposControl(false); // cierra el modal secundario
  };
  return (
    <>
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Control"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit
        },
      ]}
    >
      <Input
        label="Fecha"
        type="date"
        value={fechaControl}
        onChange={(e) => setFechaControl(e.target.value)}
        required
      />

      <Input
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />

      {/* Selector de Afección */}
      {isLoadingAfecciones ? (
        <p>Cargando afecciones...</p>
      ) : (
        <Select
          label="Afección"
          placeholder="Selecciona una afección"
          selectedKeys={fk_Afeccion ? [fk_Afeccion.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Afeccion(Number(selectedKey));
          }}
        >
          {(afecciones || []).map((afeccion) => (
            <SelectItem key={afeccion.id.toString()}>
              {afeccion.id}
            </SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Tipo de Control */}
      <div className="flex items-center gap-2 ">
        <div className="flex-1"> 
          {isLoadingTiposControl ? (
            <p>Cargando tipos de control...</p>
          ) : (
          <Select
            label="Tipo de Control"
            placeholder="Selecciona un tipo de control"
            selectedKeys={fk_TipoControl ? [fk_TipoControl.toString()] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setFk_TipoControl(Number(selectedKey));
            }}
          >
            {(tiposControl || []).map((tipo) => (
              <SelectItem key={tipo.id.toString()}>
                {tipo.nombre}
              </SelectItem>
            ))}
          </Select>
      )}
        </div>

        <Button
          onPress={() => setMostrarModalTiposControl(true)}
          color="success"
          title="Agregar nuevo tipo"
          radius="full"
          size="sm"
        >
          <Plus className="w-5 h-5 text-white" />
        </Button>

      </div>
      
    </ModalComponent>

    {mostrarModalTiposControl && (
      <CrearTipoControlModal
      onClose={() => setMostrarModalTiposControl(false)}
      onCreate={handleTipoControlCreado}
      />
    )}
    
    </>
    
  );
};
