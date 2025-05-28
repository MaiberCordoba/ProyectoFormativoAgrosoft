import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchCosechas } from '../../hooks/cosechas/usePatchCosechas';  
import { Cosechas } from '../../types';
import { Input, Select, SelectItem } from '@heroui/react';
import { useGetUnidadesMedida } from '../../hooks/unidadesMedida/useGetUnidadesMedida';
import { useGetPlantaciones } from '@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones';

interface EditarCosechaModalProps {
  cosecha: Cosechas; 
  onClose: () => void; 
}

const EditarCosechaModal: React.FC<EditarCosechaModalProps> = ({ cosecha, onClose }) => {
  const [cantidad, setCantidad] = useState<number | null>(cosecha.cantidad);
  const [fecha, setFecha] = useState<string>(cosecha.fecha);
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(cosecha.fk_Plantacion ?? null); 
  const [precioUnidad, setPrecioUnidad] = useState<number | null>(cosecha.precioUnidad ??  null)
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(cosecha.fk_UnidadMedida ?? null); 
  const [mensajeError, setMensajeError] = useState("")

  const { data: plantaciones, isLoading: isLoadingPlantaciones } = useGetPlantaciones();  
  const { data: unidadesMedida, isLoading: isLoadingUnidadMedida } = useGetUnidadesMedida();  
  const { mutate, isPending } = usePatchCosechas(); 

  const handleSubmit = () => {
    if (!fk_Plantacion || !cantidad || !fk_UnidadMedida || !fecha || !precioUnidad) {
     setMensajeError("Por favor, completa todos los campos.");
      return;
    }
    if (cantidad < 0){
      setMensajeError("La cantidad cosechada no puede ser negativa")
      return
    }
    setMensajeError("")

    mutate(
      {
        id: cosecha.id,
        data: {
          cantidad,
          fecha,
          fk_Plantacion,  
          fk_UnidadMedida,
          precioUnidad,
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
      {mensajeError &&(
          <p className="text-red-500 text-sm mb-2">{mensajeError}</p>
      )}
      <Input
        value={fecha}
        label="Fecha de Cosecha"
        type="date"
        onChange={(e) => setFecha(e.target.value)}
      />
      <Input
        value={cantidad}
        label="Cantidad cosechada"
        type="number"
        onChange={(e) => setCantidad(Number(e.target.value))}
      />
      <Input
        value={precioUnidad}
        label="Precio unidad"
        type="number"
        onChange={(e) => setPrecioUnidad(Number(e.target.value))}
      />


      {/* Selector de Cultivos */}
      {isLoadingPlantaciones ? (
        <p>Cargando Plantaciones...</p>
      ) : (
        <Select
          label="Plantaciones"
          placeholder="Selecciona una plantacion"
          selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []} 
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  
            setFk_Plantacion(selectedKey ? Number(selectedKey) : null);  
          }}
        >
          {(plantaciones || []).map((plantacion) => (
            <SelectItem key={plantacion.id.toString()}>
              {plantacion.cultivo.nombre}
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
