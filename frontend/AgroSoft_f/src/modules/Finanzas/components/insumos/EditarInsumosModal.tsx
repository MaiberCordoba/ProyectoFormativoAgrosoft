import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { Button, Input, Select, SelectItem } from '@heroui/react';
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
  const [fichaTecnica, setFichaTecnica] = useState<File | null>(null);
  const [unidades, setUnidades] = useState<number>(insumo.unidades);
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(insumo.fk_UnidadMedida || null);
  const [preview,setPreview] = useState<string | null>(null)

  const { data: unidadesMedida, isLoading: isLoadingUnidad } = useGetUnidadesMedida();
  const { mutate, isPending } = usePatchInsumos();

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append("nombre",nombre)
    formData.append("descripcion",descripcion)
    formData.append("precio",precio.toString())
    formData.append("compuestoActivo",compuestoActivo)
    formData.append("contenido",contenido.toString())
    formData.append("unidades",unidades.toString())
    formData.append("fk_UnidadMedida",fk_UnidadMedida.toString())
    if (fichaTecnica) {
      formData.append("fichaTecnica",fichaTecnica)
      return;
    }

    mutate(
      {
        id: insumo.id,
        data: formData,
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
        label="Nombre Insumo"
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
        label="Precio unidad insumo"
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
          label="Unidades compradas"
          value={unidades}
          type="number"
          onChange={(e) => setUnidades(Number(e.target.value))}
          required
        />
      <Input
        label="Contenido del insumo"
        value={contenido}
        type="number"
        onChange={(e) => setContenido(Number(e.target.value))}
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
      <div className="mt-4">
            <Button
            type="submit"
            variant="solid"
            onPress={()=> document.getElementById("imagenFichaTecnica")?.click()}
            >
              Ficha tecnica
            </Button>
            <span className="flex-1 p-3">Cargar ficha tecnica</span>
            <input 
            id="imagenFichaTecnica"
            type="file" 
            accept="image/"
            onChange={(e)=>{
              const file = e.target.files?.[0]
              if (file)
                setFichaTecnica(file)
                setPreview(URL.createObjectURL(file!))
            }}
            className="hidden"
            />
          </div>
          {preview && (
            <div className="mt-4">
              <img
              src={preview}
              alt="Vista Previa"
              className="w-48 h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
    </ModalComponent>
  );
};

export default EditarInsumoModal;
