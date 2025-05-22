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
  const [horas, setHoras] = useState<number | null>(salario.horas);
  const [estado, setEstado] = useState<"activo" | "inactivo">(salario.estado);
  const [error,setError] = useState("")

  const { mutate, isPending } = usePatchSalarios();  

  const handleSubmit = () => {
    if (!nombre || monto === null || horas === null || !estado) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError("")

    mutate(
      {
        id: salario.id,
        data: {
          nombre,
          monto,
          horas,
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
      <p className='text-red-500 text-sm mb-2'>{error}</p>
      <Input
        value={nombre}
        label="Nombre Salario"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        value={monto}
        label="Monto(valor)"
        type="number"
        onChange={(e) => setMonto(Number(e.target.value))}
        required
      />
      <Input
        value={horas}
        label="Horas de trabajo(dia)"
        type="number"
        onChange={(e) => setHoras(Number(e.target.value))}
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
