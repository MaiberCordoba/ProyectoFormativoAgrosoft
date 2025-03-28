import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchControles } from "../../hooks/controles/usePatchControles";
import { Controles } from "../../types";
import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useGetAfeccionesCultivo } from "../../hooks/afeccionescultivo/useGetAfeccionescultivo";
import { useGetTipoControl } from "../../hooks/tipoControl/useGetTipoControl";

interface EditarControlModalProps {
  control: Controles; // El control que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarControlModal: React.FC<EditarControlModalProps> = ({ control, onClose }) => {
  const [fecha, setFecha] = useState<string>(control.fecha);
  const [descripcion, setDescripcion] = useState<string>(control.descripcion);
  const [fk_Afeccion, setFk_Afeccion] = useState<number>(control.fk_Afeccion || 0);
  const [fk_TipoControl, setFk_TipoControl] = useState<number>(control.fk_TipoControl || 0);

  const { data: afeccionescultivo, isLoading: isLoadingAfecciones } = useGetAfeccionesCultivo();
  const { data: tiposControl, isLoading: isLoadingTiposControl } = useGetTipoControl();
  const { mutate, isPending } = usePatchControles();

  const handleSubmit = () => {
    mutate(
      {
        id: control.id,
        data: {
          fecha,
          descripcion,
          fk_Afeccion,
          fk_TipoControl,
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
      title="Editar Control"
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
        value={fecha}
        label="Fecha"
        type="date"
        onChange={(e) => setFecha(e.target.value)}
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
      />

      {/* Selector de Afección */}
      {isLoadingAfecciones ? (
        <p>Cargando afecciones...</p>
      ) : (
        <Select
          label="Afección"
          placeholder="Selecciona una afección"
          selectedKeys={[fk_Afeccion.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Afeccion(Number(selectedKey));
          }}
        >
          {(afeccionescultivo || []).map((afeccioncultivo) => (
            <SelectItem key={afeccioncultivo.id.toString()}>
              {afeccioncultivo.id}
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
          selectedKeys={[fk_TipoControl.toString()]}
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

export default EditarControlModal;
