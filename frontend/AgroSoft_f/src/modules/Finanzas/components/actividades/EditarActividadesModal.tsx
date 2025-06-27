import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchActividades } from '../../hooks/actividades/usePatchActividades';
import { Actividades } from '../../types';
import { Input, Textarea, Select, SelectItem } from '@heroui/react';
import { useGetCultivos } from '@/modules/Trazabilidad/hooks/cultivos/useGetCultivos'; 
import { useGetUsers } from '@/modules/Users/hooks/useGetUsers';
import { useGetTipoActividad } from '../../hooks/tipoActividad/useGetTiposActividad';
import { useGetPlantaciones } from '@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones';


interface EditarActividadesModalProps {
  actividad: Actividades;
  onClose: () => void;
}

const EditarActividadesModal: React.FC<EditarActividadesModalProps> = ({
  actividad,
  onClose,
}) => {
  const [titulo, setTitulo] = useState<string>(actividad.titulo);
  const [descripcion, setDescripcion] = useState<string>(actividad.descripcion);
  const [estado, setEstado] = useState<"AS" | "CO" | "CA" | undefined>(actividad.estado);
  const [fk_Cultivo, setFk_Cultivo] = useState<number | undefined>(actividad.fk_Cultivo || undefined);  
  const [fk_Plantacion, setFk_Plantacion] = useState<number | undefined>(actividad.fk_Plantacion || undefined);  
  const [fecha, setFecha] = useState<string| undefined>(actividad.fecha);  
  const [fk_Usuario, setFk_Usuario] = useState<number | undefined>(actividad.fk_Usuario || undefined); 
  const [fk_TipoActividad, setFk_TipoActividad] = useState<number | undefined>(actividad.fk_TipoActividad || undefined); 

  //manejo mensaje de error
  const [mensajeError, setMensajeError] = useState("");
  //
  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: plantaciones, isLoading: isLoadingPlantacion } = useGetPlantaciones();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { data: tiposActividad, isLoading: isLoadingTiposActividad } =
    useGetTipoActividad();
  const { mutate, isPending } = usePatchActividades();

  const handleSubmit = () => {
    // Verificar que todos los campos estén completos
    if (!fk_Usuario || !fk_TipoActividad || !titulo || !descripcion || !fecha || !estado) {

      setMensajeError("Por favor, completa todos los campos.");

      return;
    }
    if (fk_Cultivo &&  fk_Plantacion) {
      setMensajeError("No puede elegir cultivo y plantacion al mismo tiempo ")
      return
    }
    setMensajeError("")


    mutate(
      {
        id: actividad.id,
        data: {
          titulo,
          descripcion,
          estado,
          fecha,
          fk_Cultivo,
          fk_Plantacion,
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
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      {mensajeError && (
        <p className="text-red-500 text-sm mb-2">{mensajeError}</p>
      )}
      <Input
        value={titulo}
        label="Título"
        size="sm"
        type="text"
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        size="sm"
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <Input
        value={fecha}
        label="Fecha"
        type='date'
        size="sm"
        onChange={(e) => setFecha(e.target.value)}
        required
      />

      <Select
        label="Estado"
        size="sm"
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
          size="sm"
          placeholder="Selecciona un cultivo"
          selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Cultivo(selectedKey ? Number(selectedKey) : undefined);
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id.toString()}>
              {cultivo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
      {isLoadingPlantacion ? (
        <p>Cargando plantaciones...</p>
      ) : (
        <Select
          label="Plantacion"
          size="sm"
          placeholder="Selecciona una plantacion"
          selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []} 
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];  
            setFk_Plantacion(selectedKey ? Number(selectedKey) : undefined);  
          }}
        >
          {(plantaciones || []).map((p) => (
            <SelectItem key={p.id.toString()}>{p.cultivo?.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {isLoadingUsers ? (
        <p>Cargando usuarios...</p>
      ) : (
        <Select
          label="Usuario"
          size="sm"
          placeholder="Selecciona un Usuario"
          selectedKeys={fk_Usuario ? [fk_Usuario.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Usuario(selectedKey ? Number(selectedKey) : undefined);
          }}
        >
          {(users || []).map((usuario) => (
            <SelectItem key={usuario.id.toString()}>
              {usuario.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {isLoadingTiposActividad ? (
        <p>Cargando tipos de actividad...</p>
      ) : (
        <Select
          label="Tipos de actividad"
          size="sm"
          placeholder="Selecciona el tipo de actividad"
          selectedKeys={fk_TipoActividad ? [fk_TipoActividad.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_TipoActividad(selectedKey ? Number(selectedKey) : undefined);
          }}
        >
          {(tiposActividad || []).map((tipoActividad) => (
            <SelectItem key={tipoActividad.id.toString()}>
              {tipoActividad.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarActividadesModal;
