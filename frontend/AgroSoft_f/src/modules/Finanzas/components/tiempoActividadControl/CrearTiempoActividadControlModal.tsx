import { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetActividades } from "@/modules/Finanzas/hooks/actividades/useGetActividades";
import { useGetUnidadesTiempo } from "@/modules/Finanzas/hooks/unidadesTiempo/useGetUnidadesTiempo";
import { useGetControles } from "@/modules/Sanidad/hooks/controles/useGetControless";
import { useGetSalarios } from "@/modules/Finanzas/hooks/salarios/useGetSalarios";
import { usePostTiempoActividadControl } from "../../hooks/tiempoActividadControl/usePostTiempoActividadDesecho";

interface CrearTiempoActividadControlModalProps {
  onClose: () => void;
}

export const CrearTiempoActividadControlModal = ({ onClose }: CrearTiempoActividadControlModalProps) => {
  const [tiempo, setTiempo] = useState<number>(0);
  const [valorTotal, setValorTotal] = useState<number>(0);
  const [fk_unidadTiempo, setFk_UnidadTiempo] = useState<number | null>(null);
  const [fk_actividad, setFk_Actividad] = useState<number | null>(null);
  const [fk_control, setFk_Control] = useState<number | null>(null);
  const [fk_salario, setFk_Salario] = useState<number | null>(null);

  const { data: actividades } = useGetActividades();
  const { data: unidadesTiempo } = useGetUnidadesTiempo();
  const { data: controles } = useGetControles();
  const { data: salarios } = useGetSalarios();
  const { mutate, isPending } = usePostTiempoActividadControl();

  const handleSubmit = () => {
    if (
      !tiempo || !valorTotal ||
      !fk_unidadTiempo || !fk_actividad ||
      !fk_control || !fk_salario
    ) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { tiempo, valorTotal, fk_unidadTiempo, fk_actividad, fk_control, fk_salario },
      {
        onSuccess: () => {
          onClose();
          setTiempo(0);
          setValorTotal(0);
          setFk_UnidadTiempo(null);
          setFk_Actividad(null);
          setFk_Control(null);
          setFk_Salario(null);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registrar Tiempo Actividad"
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
        label="Tiempo"
        type="number"
        value={tiempo}
        onChange={(e) => setTiempo(Number(e.target.value))}
        required
      />
      <Input
        label="Valor Total"
        type="number"
        value={valorTotal}
        onChange={(e) => setValorTotal(Number(e.target.value))}
        required
      />

      <Select
        label="Unidad de Tiempo"
        placeholder="Selecciona una unidad"
        selectedKeys={fk_unidadTiempo ? [fk_unidadTiempo.toString()] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          setFk_UnidadTiempo(selectedKey ? Number(selectedKey) : null);
        }}
      >
        {(unidadesTiempo || []).map((unidad) => (
          <SelectItem key={unidad.id.toString()}>{unidad.nombre}</SelectItem>
        ))}
      </Select>

      <Select
        label="Actividad"
        placeholder="Selecciona una actividad"
        selectedKeys={fk_actividad ? [fk_actividad.toString()] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          setFk_Actividad(selectedKey ? Number(selectedKey) : null);
        }}
      >
        {(actividades || []).map((actividad) => (
          <SelectItem key={actividad.id.toString()}>{actividad.titulo}</SelectItem>
        ))}
      </Select>

      <Select
        label="Control"
        placeholder="Selecciona un control"
        selectedKeys={fk_control ? [fk_control.toString()] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          setFk_Control(selectedKey ? Number(selectedKey) : null);
        }}
      >
        {(controles || []).map((control) => (
          <SelectItem key={control.id.toString()}>{control.nombre}</SelectItem>
        ))}
      </Select>

      <Select
        label="Salario"
        placeholder="Selecciona un salario"
        selectedKeys={fk_salario ? [fk_salario.toString()] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          setFk_Salario(selectedKey ? Number(selectedKey) : null);
        }}
      >
        {(salarios || []).map((salario) => (
          <SelectItem key={salario.id.toString()}>{salario.nombre}</SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};
