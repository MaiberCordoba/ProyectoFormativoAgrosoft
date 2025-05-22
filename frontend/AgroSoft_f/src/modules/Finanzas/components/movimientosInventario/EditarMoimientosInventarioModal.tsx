import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { Input, Select, SelectItem } from '@heroui/react';
import { MovimientoInventario } from '../../types';
import { useGetHerramientas } from '../../hooks/herramientas/useGetHerramientas';
import { useGetUsosHerramientas } from '../../hooks/usosHerramientas/useGetUsosHerramientas';
import { usePatchMovimientoInventario } from '../../hooks/movimientoInventario/usePatchMovimientos';

interface EditarMovimientoInventarioModalProps {
  movimiento: MovimientoInventario;
  onClose: () => void;
}

const EditarMovimientoInventarioModal: React.FC<EditarMovimientoInventarioModalProps> = ({
  movimiento,
  onClose,
}) => {
  const [tipo, setTipo] = useState<'entrada' | 'salida'>(movimiento.tipo);
  const [unidades, setUnidades] = useState<number>(movimiento.unidades);
  const [fk_Herramienta, setFk_Herramienta] = useState<number | null>(movimiento.fk_Herramienta || null);
  const [fk_UsoHerramienta, setFk_UsoHerramienta] = useState<number | null>(movimiento.fk_UsoHerramienta || null);

  const { data: herramientas = [] } = useGetHerramientas();
  const { data: usosHerramientas = [] } = useGetUsosHerramientas();
  const { mutate, isPending } = usePatchMovimientoInventario();

  const handleSubmit = () => {
    mutate(
      {
        id: movimiento.id,
        data: {
          tipo,
          unidades,
          fk_Herramienta,
          fk_UsoHerramienta,
          fk_Insumo: null,
          fk_UsoInsumo: null,
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Movimiento de Inventario"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          variant: 'light',
          onClick: handleSubmit,
        },
      ]}
    >
      <Select
        label="Tipo de Movimiento"
        selectedKeys={[tipo]}
        onSelectionChange={(keys) => setTipo(keys.values().next().value as 'entrada' | 'salida')}
      >
        <SelectItem key="entrada">Entrada</SelectItem>
        <SelectItem key="salida">Salida</SelectItem>
      </Select>

      <Input
        label="Unidades"
        type="number"
        value={unidades}
        onChange={(e) => setUnidades(Number(e.target.value))}
        required
      />

      <Select
        label="Herramienta"
        placeholder="Selecciona una herramienta"
        selectedKeys={fk_Herramienta ? [fk_Herramienta.toString()] : []}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          setFk_Herramienta(key ? Number(key) : null);
        }}
      >
        {herramientas.map((h) => (
          <SelectItem key={h.id.toString()}>{h.nombre}</SelectItem>
        ))}
      </Select>

      <Select
        label="Uso de Herramienta"
        placeholder="Selecciona un uso"
        selectedKeys={fk_UsoHerramienta ? [fk_UsoHerramienta.toString()] : []}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          setFk_UsoHerramienta(key ? Number(key) : null);
        }}
      >
        {usosHerramientas.map((uso) => (
          <SelectItem key={uso.id.toString()}>
            {uso.actividad?.nombre || `Uso ${uso.id}`}
          </SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

export default EditarMovimientoInventarioModal;
