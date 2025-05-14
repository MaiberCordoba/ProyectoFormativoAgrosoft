import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchUsosInsumos } from "../../hooks/usoInsumos/usePatchUsoInsumos";
import { UsosInsumos } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";

interface EditarUsoInsumoModalProps {
  usoInsumo: UsosInsumos;
  onClose: () => void;
}

const EditarUsoInsumoModal: React.FC<EditarUsoInsumoModalProps> = ({ usoInsumo, onClose }) => {
  const [fk_Insumo, setFk_Insumo] = useState<number>(usoInsumo.insumo?.id || 0);
  const [fk_Actividad, setFk_Actividad] = useState<number>(usoInsumo.actividad?.id || 0);
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number>(usoInsumo.unidadMedida?.id || 0);
  const [cantidadProducto, setCantidadProducto] = useState<number>(usoInsumo.cantidadProducto);

  const { data: insumos, isLoading: isLoadingInsumos } = useGetInsumos();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { data: unidadesMedida, isLoading: isLoadingUnidades } = useGetUnidadesMedida();

  const { mutate, isPending } = usePatchUsosInsumos();

  const handleSubmit = () => {
    mutate(
      {
        id: usoInsumo.id,
        data: {
          fk_Insumo,
          fk_Actividad,
          fk_UnidadMedida,
          cantidadProducto,
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
      title="Editar Uso de Insumo"
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
        label="Cantidad Usada"
        value={cantidadProducto}
        type="number"
        onChange={(e) => setCantidadProducto(Number(e.target.value))}
        required
      />

      {/* Selector de Insumos */}
      {isLoadingInsumos ? (
        <p>Cargando insumos...</p>
      ) : (
        <Select
          label="Insumo"
          placeholder="Selecciona un insumo"
          selectedKeys={[fk_Insumo.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Insumo(Number(selectedKey));
          }}
        >
          {(insumos || []).map((insumo) => (
            <SelectItem key={insumo.id.toString()}>{insumo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Actividades */}
      {isLoadingActividades ? (
        <p>Cargando actividades...</p>
      ) : (
        <Select
          label="Actividad"
          placeholder="Selecciona una actividad"
          selectedKeys={[fk_Actividad.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Actividad(Number(selectedKey));
          }}
        >
          {(actividades || []).map((actividad) => (
            <SelectItem key={actividad.id.toString()}>{actividad.titulo}</SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Unidad de Medida */}
      {isLoadingUnidades ? (
        <p>Cargando unidades de medida...</p>
      ) : (
        <Select
          label="Unidad de Medida"
          placeholder="Selecciona una unidad"
          selectedKeys={[fk_UnidadMedida.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_UnidadMedida(Number(selectedKey));
          }}
        >
          {(unidadesMedida || []).map((unidad) => (
            <SelectItem key={unidad.id.toString()}>{unidad.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarUsoInsumoModal;
