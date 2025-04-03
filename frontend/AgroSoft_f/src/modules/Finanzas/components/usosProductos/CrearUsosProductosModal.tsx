import { useState } from "react";
import { usePostUsoProducto } from "../../hooks/usosProductos/usePostUsosProductos";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";

interface CrearUsosProductosModalProps {
  onClose: () => void;
}

export const CrearUsosProductosModal = ({ onClose }: CrearUsosProductosModalProps) => {
  const [fk_Insumo, setFk_Insumo] = useState<number | null>(null);
  const [fk_Actividad, setFk_Actividad] = useState<number | null>(null);
  const [cantidadProducto, setCantidadProducto] = useState<number>(0);

  const { data: insumos, isLoading: isLoadingInsumos } = useGetInsumos();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { mutate, isPending } = usePostUsoProducto();

  const handleSubmit = () => {
    if (!fk_Insumo || !fk_Actividad || cantidadProducto <= 0) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Insumo, fk_Actividad, cantidadProducto },
      {
        onSuccess: () => {
          onClose();
          setFk_Insumo(null);
          setFk_Actividad(null);
          setCantidadProducto(0);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Uso de Productos"
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
        label="Cantidad de Producto"
        type="number"
        value={cantidadProducto}
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
          selectedKeys={fk_Insumo ? [fk_Insumo.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Insumo(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(insumos || []).map((insumo) => (
            <SelectItem key={insumo.id.toString()} textValue={insumo.nombre}>
              {insumo.nombre}
            </SelectItem>
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
          selectedKeys={fk_Actividad ? [fk_Actividad.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Actividad(selectedKey ? Number(selectedKey) : null);
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
