import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchCosechas } from '../../hooks/cosechas/usePatchCosechas';  // Cambié el hook
import { Cosechas } from '../../types';
import { Input, Select, SelectItem } from '@heroui/react';
import { useGetCultivos } from '@/modules/Trazabilidad/hooks/cultivos/useGetCultivos';  // Cambié el hook
import { useGetUnidadesMedida } from '../../hooks/unidadesMedida/useGetUnidadesMedida';
import { useGetPlantaciones } from '@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones';

interface EditarCosechaModalProps {
  cosecha: Cosechas; // La cosecha que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarCosechaModal: React.FC<EditarCosechaModalProps> = ({ cosecha, onClose }) => {
  const [cantidad, setCantidad] = useState<number | null>(cosecha.cantidad);
  const [fecha, setFecha] = useState<string>(cosecha.fecha);
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(cosecha.fk_Plantacion ?? null); // Estado para el ID del cultivo
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(cosecha.fk_UnidadMedida ?? null); // Estado para el ID del cultivo

  const { data: plantaciones, isLoading: isLoadingPlantaciones } = useGetPlantaciones();  // Obtener los cultivos
  const { data: unidadesMedida, isLoading: isLoadingUnidadMedida } = useGetUnidadesMedida();  // Obtener los cultivos
  const { mutate, isPending } = usePatchCosechas();  // Mutación para actualizar las cosechas

  const handleSubmit = () => {
    if (!fk_Plantacion || !cantidad || !fk_UnidadMedida || !fecha) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    // Llama a la mutación para actualizar la cosecha
    mutate(
      {
        id: cosecha.id,
        data: {
          cantidad,
          fecha,
          fk_Plantacion,  // Envía solo el ID del cultivo
          fk_UnidadMedida,
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
        value={fecha}
        label="Fecha de Cosecha"
        type="date"
        onChange={(e) => setFecha(e.target.value)}
      />
      <Input
        value={cantidad}
        label="Cantidad Cosechada"
        type="number"
        onChange={(e) => setCantidad(Number(e.target.value))}
      />


      {/* Selector de Cultivos */}
      {isLoadingPlantaciones ? (
        <p>Cargando Plantaciones...</p>
      ) : (
        <Select
          label="Plantaciones"
          placeholder="Selecciona una plantacion"
          selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []}  // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  // HeroUI devuelve un Set
            setFk_Plantacion(selectedKey ? Number(selectedKey) : null);  // Actualiza el estado con el nuevo ID
          }}
        >
          {(plantaciones || []).map((plantacion) => (
            <SelectItem key={plantacion.id.toString()}>
              {plantacion.fk_Cultivo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
      {isLoadingUnidadMedida ? (
        <p>Cargando unidades de medida...</p>
      ) : (
        <Select
        label="Unidad de medida"
        placeholder="Selecciona una unidad de medida"
        selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}  // HeroUI espera un array de strings
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];  // HeroUI devuelve un Set
          setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);  // Actualiza el estado con el nuevo ID
        }}
        >
          {(unidadesMedida || []).map((unidadMedida) => (
            <SelectItem key={unidadMedida.id.toString()}>
              {unidadMedida.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarCosechaModal;
