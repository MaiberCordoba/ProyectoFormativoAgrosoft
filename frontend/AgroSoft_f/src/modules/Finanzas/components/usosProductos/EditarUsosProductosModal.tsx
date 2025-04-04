import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchUsosProductos } from "../../hooks/usosProductos/usePatchUsosProductos";
import { UsosProductos } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";

interface EditarUsoProductoModalProps {
  usoProducto: UsosProductos;
  onClose: () => void;
}

const EditarUsoProductoModal: React.FC<EditarUsoProductoModalProps> = ({ usoProducto, onClose }) => {
  const [cantidadProducto, setCantidadProducto] = useState<number>(usoProducto.cantidadProducto);
  const [fk_Insumo, setFk_Insumo] = useState<number>(usoProducto.insumo?.id || 0);
  const [fk_Actividad, setFk_Actividad] = useState<number>(usoProducto.actividad?.id || 0);

  const { data: insumos, isLoading: isLoadingInsumos } = useGetInsumos();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { mutate, isPending } = usePatchUsosProductos();

  const handleSubmit = () => {
    mutate(
      {
        id: usoProducto.id,
        data: {
          cantidadProducto,
          fk_Insumo,
          fk_Actividad,
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
      title="Editar Uso de Producto"
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
        value={cantidadProducto}
        label="Cantidad del Producto"
        type="number"
        onChange={(e) => setCantidadProducto(Number(e.target.value))}
      />

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
            <SelectItem key={insumo.id.toString()} textValue={insumo.nombre}>
              {insumo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

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
            <SelectItem key={actividad.id.toString()} textValue={actividad.titulo}>
              {actividad.titulo}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarUsoProductoModal;
