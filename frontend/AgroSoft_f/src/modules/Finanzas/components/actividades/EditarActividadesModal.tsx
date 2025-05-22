import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchActividades } from '../../hooks/actividades/usePatchActividades';
import { Actividades } from '../../types';
import { Input, Textarea, Select, SelectItem } from '@heroui/react';
import { useGetCultivos } from '@/modules/Trazabilidad/hooks/cultivos/useGetCultivos'; 
import { useGetUsers } from '@/modules/Users/hooks/useGetUsers';
import { useGetTipoActividad } from '../../hooks/tipoActividad/useGetTiposActividad';

interface EditarActividadesModalProps {
  actividad: Actividades;
  onClose: () => void;
}

const EditarActividadesModal: React.FC<EditarActividadesModalProps> = ({ actividad, onClose }) => {
  const [titulo, setTitulo] = useState<string>(actividad.titulo);
  const [descripcion, setDescripcion] = useState<string>(actividad.descripcion);
  const [estado, setEstado] = useState<"AS" | "CO" | "CA">(actividad.estado);
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(actividad.fk_Cultivo || null);  
  const [fk_Usuario, setFk_Usuario] = useState<number | null>(actividad.fk_Usuario || null); 
  const [fk_TipoActividad, setFk_TipoActividad] = useState<number | null>(actividad.fk_TipoActividad || null); 
  //manejo mensaje de error
  const [mensajeError, setMensajeError] = useState("")
  //
  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { data: tiposActividad, isLoading: isLoadingTiposActividad } = useGetTipoActividad();
  const { mutate, isPending } = usePatchActividades();  

  const handleSubmit = () => {
    // Verificar que todos los campos estén completos
    if (!fk_Cultivo || !fk_Usuario || !fk_TipoActividad || !titulo || !descripcion || !fecha || !estado) {
      setMensajeError("Por favor, completa todos los campos.");

      return;
    }
    setMensajeError("")

    mutate(
      {
        id: actividad.id,
        data: {
          titulo,
          descripcion,
          estado,
          fk_Cultivo,  
          fk_Usuario, 
          fk_TipoActividad,
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
      title="Editar Actividad"
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
        <p className='text-red-500 text-sm mb-2'>{mensajeError}</p>
      )}
      <Input
        value={titulo}
        label="Título"
        type="text"
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />

      <Select
        label="Estado"
        value={estado}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as "AS" | "CO" | "CA";
          setEstado(selectedKey);
        }}
        required
      >
        <SelectItem key="AS">Asignado</SelectItem>
        <SelectItem key="CO">Completado</SelectItem>
        <SelectItem key="CA">Cancelado</SelectItem>
      </Select>

      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []} 
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  
            setFk_Cultivo(selectedKey ? Number(selectedKey) : null);  
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id.toString()}>{cultivo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {isLoadingUsers ? (
        <p>Cargando usuarios...</p>
      ) : (
        <Select
          label="Usuario"
          placeholder="Selecciona un Usuario"
          selectedKeys={fk_Usuario ? [fk_Usuario.toString()] : []} 
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  
            setFk_Usuario(selectedKey ? Number(selectedKey) : null);  
          }}
        >
          {(users || []).map((usuario) => (
            <SelectItem key={usuario.id.toString()}>{usuario.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {isLoadingTiposActividad ? (
        <p>Cargando tipos de actividad...</p>
      ) : (
        <Select
          label="Tipos de actividad"
          placeholder="Selecciona el tipo de actividad"
          selectedKeys={fk_TipoActividad ? [fk_TipoActividad.toString()] : []} 
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  
            setFk_TipoActividad(selectedKey ? Number(selectedKey) : null);  
          }}
        >
          {(tiposActividad || []).map((tipoActividad) => (
            <SelectItem key={tipoActividad.id.toString()}>{tipoActividad.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarActividadesModal;
