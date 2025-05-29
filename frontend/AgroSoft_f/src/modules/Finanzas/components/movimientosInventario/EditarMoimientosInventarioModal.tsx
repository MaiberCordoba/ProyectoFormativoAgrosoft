import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { Input, Select, SelectItem } from '@heroui/react';
import { MovimientoInventario } from '../../types';
import { useGetHerramientas } from '../../hooks/herramientas/useGetHerramientas';
import { usePatchMovimientoInventario } from '../../hooks/movimientoInventario/usePatchMovimientos';
import { useGetInsumos } from '../../hooks/insumos/useGetInsumos';

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
  const [fkInsumo, setFkInsumo] = useState<number | null>(movimiento.fk_Insumo || null);
  const [error,setError] = useState("")


  const { data: herramientas = [] } = useGetHerramientas();
  const { data: insumos = [] } = useGetInsumos();
  const { mutate, isPending } = usePatchMovimientoInventario();


  const handleSubmit = () => {
     if (!unidades || unidades <= 0) {
      setError("Por favor, ingresa una cantidad válida.");
      return;
    }
    if (fkInsumo &&  fk_Herramienta){
      setError("Solo se puede registrar un movimiento para insumo o herramienta, no ambos.");
      return
    }
    setError("")
    mutate(
      {
        id: movimiento.id,
        data: {
          tipo,
          unidades,
          fk_Herramienta,
          fk_Insumo: fkInsumo,
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
      <p className='text-red-500 text-sm mb-2'>{error}</p>
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
        label="Insumo"
        placeholder="Selecciona un insumo"
        selectedKeys={fkInsumo ? [fkInsumo.toString()] : []}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          setFkInsumo(key ? Number(key) : null);
        }}
      >
        {insumos.map((uso) => (
          <SelectItem key={uso.id.toString()}>
            {uso.nombre}
          </SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

export default EditarMovimientoInventarioModal;
