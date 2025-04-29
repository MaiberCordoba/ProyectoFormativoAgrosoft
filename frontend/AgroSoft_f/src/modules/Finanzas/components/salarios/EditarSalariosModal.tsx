import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchSalarios } from '../../hooks/salarios/usePatchSalarios'; // Hook para actualizar salarios
import { Salarios } from '../../types';
import { Input, Select, SelectItem } from '@heroui/react';

interface EditarSalariosModalProps {
  salario: Salarios; // El salario que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarSalariosModal: React.FC<EditarSalariosModalProps> = ({ salario, onClose }) => {
  const [nombre, setNombre] = useState<string>(salario.nombre);
  const [monto, setMonto] = useState<number>(salario.monto);
  const [horas, setHoras] = useState<number>(salario.horas);
  const [monto_minutos, setMontoMinutos] = useState<number>(salario.monto_minutos);
  const [estado, setEstado] = useState<"activo" | "inactivo">(salario.estado);

  const { mutate, isPending } = usePatchSalarios();  

  const handleSubmit = () => {
    if (!nombre || monto === null || horas === null || monto_minutos === null || !estado) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        id: salario.id,
        data: {
          nombre,
          monto,
          horas,
          monto_minutos,
          estado,
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
      title="Editar Salario"
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
        required
      />
      <Input
        value={monto}
        label="Monto"
        type="number"
        onChange={(e) => setMonto(Number(e.target.value))}
        required
      />
      <Input
        value={horas}
        label="Horas"
        type="number"
        onChange={(e) => setHoras(Number(e.target.value))}
        required
      />
      <Input
        value={monto_minutos}
        label="Monto por Minuto"
        type="number"
        onChange={(e) => setMontoMinutos(Number(e.target.value))}
        required
      />

      <Select
        label="Estado"
        value={estado}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as "activo" | "inactivo";
          setEstado(selectedKey);
        }}
        required
      >
        <SelectItem key="activo">Activo</SelectItem>
        <SelectItem key="inactivo">Inactivo</SelectItem>
      </Select>
    </ModalComponent>
  );
};

export default EditarSalariosModal;
