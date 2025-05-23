import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { Input } from '@heroui/react';
import { usePatchUnidadesTiempo } from '../../hooks/unidadesTiempo/usePatchUnidadesTiempo';
import { UnidadesTiempo } from '../../types';

interface EditarUnidadesTiempoModalProps {
  unidadTiempo: UnidadesTiempo;
  onClose: () => void;
}

const EditarUnidadesTiempoModal: React.FC<EditarUnidadesTiempoModalProps> = ({ unidadTiempo, onClose }) => {
  const [nombre, setNombre] = useState<string>(unidadTiempo.nombre);
  const [equivalenciaMinutos, setEquivalenciaMinutos] = useState<number>(unidadTiempo.equivalenciaMinutos);

  const { mutate, isPending } = usePatchUnidadesTiempo();

  const handleSubmit = () => {
    mutate(
      {
        id: unidadTiempo.id,
        data: {
          nombre,
          equivalenciaMinutos,
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
      title="Editar Unidad de Tiempo"
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
        value={nombre}
        label="Nombre"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
      />
      <Input
        value={equivalenciaMinutos.toString()}
        label="Equivalencia Minutos"
        type="number"
        onChange={(e) => setEquivalenciaMinutos(Number(e.target.value))}
      />
    </ModalComponent>
  );
};

export default EditarUnidadesTiempoModal;
