import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchHerramientas } from '../../hooks/herramientas/usePatchHerramientas'; // Cambié el hook
import { Herramientas } from '../../types';
import { Input, Textarea, Select, SelectItem } from '@heroui/react';
import { useGetLotes } from '@/modules/Trazabilidad/hooks/lotes/useGetLotes'; // Cambié el hook

interface EditarHerramientaModalProps {
  herramienta: Herramientas; // La herramienta que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarHerramientaModal: React.FC<EditarHerramientaModalProps> = ({ herramienta, onClose }) => {
  const [nombre, setNombre] = useState<string>(herramienta.nombre);
  const [descripcion, setDescripcion] = useState<string>(herramienta.descripcion);
  const [unidades, setUnidades] = useState<number>(herramienta.unidades);
  const [fk_Lote, setFk_Lote] = useState<number | undefined>(herramienta.fk_Lote); // Estado para el ID del lote

  const { data: lotes, isLoading: isLoadingLotes } = useGetLotes(); // Obtener los lotes
  const { mutate, isPending } = usePatchHerramientas(); // Mutación para actualizar herramientas

  const handleSubmit = () => {
    // Llama a la mutación para actualizar la herramienta
    mutate(
      {
        id: herramienta.id,
        data: {
          nombre,
          descripcion,
          unidades,
          fk_Lote, // Envía solo el ID del lote
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
      title="Editar Herramienta"
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
      <Input
        value={unidades}
        label="Unidades"
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
      />

      {/* Selector de Lotes */}
      {isLoadingLotes ? (
        <p>Cargando lotes...</p>
      ) : (
        <Select
          label="Lote"
          placeholder="Selecciona un lote"
          selectedKeys={fk_Lote ? [fk_Lote.toString()] : []} // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
            setFk_Lote(selectedKey ? Number(selectedKey) : undefined); // Actualiza el estado con el nuevo ID
          }}
        >
          {(lotes || []).map((lote) => (
            <SelectItem key={lote.id.toString()}>
              {lote.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarHerramientaModal;
