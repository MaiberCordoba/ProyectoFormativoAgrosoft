import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { Input, Select, SelectItem } from '@heroui/react';
import { usePatchInsumos } from '../../hooks/insumos/usePatchInsumos';
import { Insumos } from '../../types';
import { useGetUnidadesMedida } from '@/modules/Finanzas/hooks/unidadesMedida/useGetUnidadesMedida';

interface EditarInsumoModalProps {
  insumo: Insumos;
  onClose: () => void;
}

const EditarInsumoModal: React.FC<EditarInsumoModalProps> = ({ insumo, onClose }) => {
  const [nombre, setNombre] = useState(insumo.nombre);
  const [descripcion, setDescripcion] = useState(insumo.descripcion);
  const [precio, setPrecio] = useState<number>(insumo.precio);
  const [compuestoActivo, setCompuestoActivo] = useState(insumo.compuestoActivo);
  const [contenido, setContenido] = useState<number>(insumo.contenido);
  const [fichaTecnica, setFichaTecnica] = useState(insumo.fichaTecnica);
  const [unidades, setUnidades] = useState<number>(insumo.unidades);
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(insumo.fk_UnidadMedida || null);

  const { data: unidadesMedida, isLoading: isLoadingUnidad } = useGetUnidadesMedida();
  const { mutate, isPending } = usePatchInsumos();

  const handleSubmit = () => {
    if (!nombre || !descripcion || precio === null || !compuestoActivo || contenido === null || !fichaTecnica || unidades === null || fk_UnidadMedida === null) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        id: insumo.id,
        data: {
          nombre,
          descripcion,
          precio,
          compuestoActivo,
          contenido,
          fichaTecnica,
          unidades,
          fk_UnidadMedida,
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
      title="Editar Insumo"
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
        label="Nombre"
        value={nombre}
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        label="Descripción"
        value={descripcion}
        type="text"
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <Input
        label="Precio"
        value={precio}
        type="number"
        onChange={(e) => setPrecio(Number(e.target.value))}
        required
      />
      <Input
        label="Compuesto Activo"
        value={compuestoActivo}
        type="text"
        onChange={(e) => setCompuestoActivo(e.target.value)}
        required
      />
      <Input
        label="Contenido"
        value={contenido}
        type="number"
        onChange={(e) => setContenido(Number(e.target.value))}
        required
      />
      <Input
        label="Ficha Técnica"
        value={fichaTecnica}
        type="text"
        onChange={(e) => setFichaTecnica(e.target.value)}
        required
      />
      <Input
        label="Unidades"
        value={unidades}
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
        required
      />
      {isLoadingUnidad ? (
        <p>Cargando unidades de medida...</p>
      ) : (
        <Select
          label="Unidad de Medida"
          placeholder="Selecciona una unidad"
          selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(unidadesMedida || []).map((unidad) => (
            <SelectItem key={unidad.id.toString()}>{unidad.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarInsumoModal;
