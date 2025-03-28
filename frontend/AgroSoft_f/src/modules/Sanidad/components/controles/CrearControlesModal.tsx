import { useState } from "react";
import { postControles} from "../../hooks/controles/usePostControles";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, toast } from "@heroui/react";
import { useGetAfeccionesCultivo } from "../../hooks/afeccionescultivo/useGetAfeccionescultivo";
import { useGetTipoControl } from "../../hooks/tipoControl/useGetTipoControl";

interface CrearControlModalProps {
  onClose: () => void;
}

export const CrearControlModal = ({ onClose }: CrearControlModalProps) => {
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fk_Afeccion, setFk_Afeccion] = useState<number | null>(null);
  const [fk_TipoControl, setFk_TipoControl] = useState<number | null>(null);

  const { data: afecciones, isLoading: isLoadingAfecciones } = useGetAfeccionesCultivo();
  const { data: tiposControl, isLoading: isLoadingTiposControl } = useGetTipoControl();
  const { mutate, isPending } = postControles();

  const handleSubmit = () => {
    if (!fecha || !descripcion || !fk_Afeccion || !fk_TipoControl) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { fecha, descripcion, fk_Afeccion, fk_TipoControl }, 
      {
        onSuccess: () => {
          onClose();
          setFecha("");
          setDescripcion("");
          setFk_Afeccion(null);
          setFk_TipoControl(null);
        },
      }
    );
  };

  return (
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
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
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
    </ModalComponent>
  );
};
