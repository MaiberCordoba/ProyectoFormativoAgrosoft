import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchCosechas } from '../../hooks/cosechas/usePatchCosechas';  // Cambié el hook
import { Cosechas } from '../../types';
import { Input, Select, SelectItem } from '@heroui/react';
import { useGetCultivos } from '@/modules/Trazabilidad/hooks/cultivos/useGetCultivos';  // Cambié el hook

interface EditarCosechaModalProps {
  cosecha: Cosechas; // La cosecha que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarCosechaModal: React.FC<EditarCosechaModalProps> = ({ cosecha, onClose }) => {
  const [unidades, setUnidades] = useState<number>(cosecha.unidades);
  const [fecha, setFecha] = useState<string>(cosecha.fecha);
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(cosecha.fk_Cultivo ?? null); // Estado para el ID del cultivo

  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();  // Obtener los cultivos
  const { mutate, isPending } = usePatchCosechas();  // Mutación para actualizar las cosechas

  const handleSubmit = () => {
    if (!fk_Cultivo || unidades <= 0 || !fecha) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    // Llama a la mutación para actualizar la cosecha
    mutate(
      {
        id: cosecha.id,
        data: {
          unidades,
          fecha,
          fk_Cultivo,  // Envía solo el ID del cultivo
        },
      },
      {
        onSuccess: () => {
          onClose();  // Cierra el modal después de guardar
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Cosecha"
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
        value={unidades}
        label="Unidades"
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
      />
      <Input
        value={fecha}
        label="Fecha"
        type="date"
        onChange={(e) => setFecha(e.target.value)}
      />

      {/* Selector de Cultivos */}
      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []}  // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  // HeroUI devuelve un Set
            setFk_Cultivo(selectedKey ? Number(selectedKey) : null);  // Actualiza el estado con el nuevo ID
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id.toString()}>
              {cultivo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarCosechaModal;
