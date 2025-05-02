import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchCosechas } from '../../hooks/cosechas/usePatchCosechas';  // Cambié el hook
import { Cosechas } from '../../types';
import { Input, Select, SelectItem } from '@heroui/react';
import { useGetCultivos } from '@/modules/Trazabilidad/hooks/cultivos/useGetCultivos';  // Cambié el hook
import { useGetUnidadesMedida } from '../../hooks/unidadesMedida/useGetUnidadesMedida';

interface EditarCosechaModalProps {
  cosecha: Cosechas; // La cosecha que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarCosechaModal: React.FC<EditarCosechaModalProps> = ({ cosecha, onClose }) => {
  const [cantidad, setCantidad] = useState<number>(cosecha.cantidad);
  const [fecha, setFecha] = useState<string>(cosecha.fecha);
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(cosecha.fk_Cultivo ?? null); // Estado para el ID del cultivo
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(cosecha.fk_UnidadMedida ?? null); // Estado para el ID del cultivo
  const [precioReferencial, setPrecioReferencial] = useState<number>(cosecha.precioReferencial); // Estado para el ID del cultivo

  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();  // Obtener los cultivos
  const { data: unidadesMedida, isLoading: isLoadingUnidadMedida } = useGetUnidadesMedida();  // Obtener los cultivos
  const { mutate, isPending } = usePatchCosechas();  // Mutación para actualizar las cosechas

  const handleSubmit = () => {
    if (!fk_Cultivo || cantidad <= 0 || !fk_UnidadMedida || !fecha || !precioReferencial) {
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
          fk_Cultivo,  // Envía solo el ID del cultivo
          fk_UnidadMedida,
          precioReferencial
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
      <Input
        value={precioReferencial}
        label="Precio de referencia"
        type="number"
        onChange={(e) => setPrecioReferencial(Number(e.target.value))}
      />
    </ModalComponent>
  );
};

export default EditarCosechaModal;
