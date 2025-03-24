import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchAfecciones } from '../../hooks/afecciones/usePatchAfecciones';
import { Afecciones } from '../../types';
import { Input,Textarea,Select, SelectItem } from '@heroui/react';
import { useGetTipoAfecciones } from '../../hooks/tiposAfecciones/useGetTipoAfecciones'; 

interface EditarAfeccionModalProps {
  afeccion: Afecciones; // La afección que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarAfeccionModal: React.FC<EditarAfeccionModalProps> = ({ afeccion, onClose }) => {
  const [nombre, setNombre] = useState<string>(afeccion.nombre);
  const [descripcion, setDescripcion] = useState<string>(afeccion.descripcion);
  const [fk_Tipo, setFk_Tipo] = useState<number>(afeccion.tipoPlaga.id); // Estado para el ID del tipo de plaga

  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } = useGetTipoAfecciones(); // Obtener los tipos de plaga
  const { mutate, isPending } = usePatchAfecciones();

  const handleSubmit = () => {
    // Llama a la mutación para actualizar la afección
    mutate(
      {
        id: afeccion.id,
        data: {
          nombre,
          descripcion,
          fk_Tipo, // Envía solo el ID del tipo de plaga
        },
      },
      {
        onSuccess: () => {
          onClose(); // Cierra el modal después de guardar
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Afección"
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

      {/* Selector de tipos de plaga con HeroUI */}
      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          selectedKeys={[fk_Tipo.toString()]} // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
            setFk_Tipo(Number(selectedKey)); // Actualiza el estado con el nuevo ID
          }}
        >
          {(tiposPlaga || []).map((tipo) => ( // Usa un array vacío como valor por defecto
            <SelectItem key={tipo.id.toString()} >
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarAfeccionModal;