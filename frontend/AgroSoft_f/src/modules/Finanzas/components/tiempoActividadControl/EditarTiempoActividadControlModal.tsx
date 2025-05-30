import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchTiempoActividadControl } from '../../hooks/tiempoActividadControl/usePatchTiempoActividadDesecho';
import { TiempoActividadControl } from '../../types';
import { Input, Select, SelectItem } from '@heroui/react';
import { useGetActividades } from '@/modules/Finanzas/hooks/actividades/useGetActividades';
import { useGetUnidadesTiempo } from '@/modules/Finanzas/hooks/unidadesTiempo/useGetUnidadesTiempo';
import { useGetControles } from '@/modules/Sanidad/hooks/controles/useGetControless';
import { useGetSalarios } from '@/modules/Finanzas/hooks/salarios/useGetSalarios';

interface EditarTiempoActividadControlModalProps {
  tiempoActividadControl: TiempoActividadControl;
  onClose: () => void;
}

const EditarTiempoActividadControlModal: React.FC<EditarTiempoActividadControlModalProps> = ({
  tiempoActividadControl,
  onClose,
}) => {
  const [tiempo, setTiempo] = useState<number>(tiempoActividadControl.tiempo);
  const [valorTotal, setValorTotal] = useState<number>(tiempoActividadControl.valorTotal);
  const [fk_unidadTiempo, setFk_UnidadTiempo] = useState<number>(tiempoActividadControl.fk_unidadTiempo);
  const [fk_actividad, setFk_Actividad] = useState<number>(tiempoActividadControl.fk_actividad);
  const [fk_control, setFk_Control] = useState<number>(tiempoActividadControl.fk_control);
  const [fk_salario, setFk_Salario] = useState<number>(tiempoActividadControl.fk_salario);

  const { data: actividades } = useGetActividades();
  const { data: unidadesTiempo } = useGetUnidadesTiempo();
  const { data: controles } = useGetControles();
  const { data: salarios } = useGetSalarios();
  const { mutate, isPending } = usePatchTiempoActividadControl();

  const handleSubmit = () => {
    if (!tiempo || !valorTotal || !fk_unidadTiempo || !fk_salario) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        id: tiempoActividadControl.id,
        data: {
          tiempo,
          valorTotal,
          fk_unidadTiempo,
          fk_actividad,
          fk_control,
          fk_salario,
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
      title="Editar Tiempo Actividad"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          variant: 'light',
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={tiempo}
        label="Tiempo"
        type="number"
        onChange={(e) => setTiempo(Number(e.target.value))}
        required
      />
      <Input
        value={valorTotal}
        label="Valor Total"
        type="number"
        onChange={(e) => setValorTotal(Number(e.target.value))}
        required
      />

      <Select
        label="Unidad de Tiempo"
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
        selectedKeys={fk_control ? [fk_control.toString()] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          setFk_Control(selectedKey ? Number(selectedKey) : null);
        }}
      >
        {(controles || []).map((control) => (
          <SelectItem key={control.id.toString()}>{control.descripcion}</SelectItem>
        ))}
      </Select>

      <Select
        label="Salario"
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

export default EditarTiempoActividadControlModal;
