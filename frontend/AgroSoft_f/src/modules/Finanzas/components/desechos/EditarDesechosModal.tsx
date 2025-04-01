import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchDesechos } from '../../hooks/desechos/usePatchDesechos';  // Cambié el hook
import { Desechos } from '../../types';
import { Input, Textarea, Select, SelectItem } from '@heroui/react';
import { useGetTiposDesechos } from '../../hooks/tiposDesechos/useGetTiposDesechos';  // Cambié el hook
import { useGetCultivos } from '@/modules/Trazabilidad/hooks/cultivos/useGetCultivos';  // Cambié el hook

interface EditarDesechoModalProps {
  desecho: Desechos; // El desecho que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarDesechoModal: React.FC<EditarDesechoModalProps> = ({ desecho, onClose }) => {
  const [nombre, setNombre] = useState<string>(desecho.nombre);
  const [descripcion, setDescripcion] = useState<string>(desecho.descripcion);
  const [fk_Cultivo, setFk_Cultivo] = useState<number>(desecho.cultivo.id);  // Estado para el ID del cultivo
  const [fk_TipoDesecho, setFk_TipoDesecho] = useState<number>(desecho.tipoDesecho.id); // Estado para el ID del tipo de desecho

  const { data: tiposDesechos, isLoading: isLoadingTiposDesechos } = useGetTiposDesechos();  // Obtener los tipos de desechos
  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();  // Obtener los cultivos
  const { mutate, isPending } = usePatchDesechos();  // Mutación para actualizar los desechos

  const handleSubmit = () => {
    // Llama a la mutación para actualizar el desecho
    mutate(
      {
        id: desecho.id,
        data: {
          nombre,
          descripcion,
          fk_Cultivo,  // Envía solo el ID del cultivo
          fk_TipoDesecho,  // Envía solo el ID del tipo de desecho
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
      title="Editar Desecho"
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
      <Textarea
        value={descripcion}
        label="Descripción"
        type="text"
        onChange={(e) => setDescripcion(e.target.value)}
      />

      {/* Selector de Cultivos */}
      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={[fk_Cultivo.toString()]}  // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  // HeroUI devuelve un Set
            setFk_Cultivo(Number(selectedKey));  // Actualiza el estado con el nuevo ID
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id.toString()}>
              {cultivo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Tipos de Desechos */}
      {isLoadingTiposDesechos ? (
        <p>Cargando tipos de desechos...</p>
      ) : (
        <Select
          label="Tipo de Desecho"
          placeholder="Selecciona un tipo de desecho"
          selectedKeys={[fk_TipoDesecho.toString()]}  // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  // HeroUI devuelve un Set
            setFk_TipoDesecho(Number(selectedKey));  // Actualiza el estado con el nuevo ID
          }}
        >
          {(tiposDesechos || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarDesechoModal;
