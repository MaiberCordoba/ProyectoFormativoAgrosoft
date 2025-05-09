import { useState } from "react";
import { usePostActividades } from "../../hooks/actividades/usePostActividades";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem,Button } from "@heroui/react";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { useGetTipoActividad } from "../../hooks/tipoActividad/useGetTiposActividad";
import { Plus } from "lucide-react";
import { TipoActividad } from "../../types";
import { CrearTipoActividadModal } from "../tipoActividad/CrearTipoActividadModal";

interface CrearActividadesModalProps {
  onClose: () => void;
}

export const CrearActividadesModal = ({ onClose }: CrearActividadesModalProps) => {
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null);
  const [fk_Usuario, setFk_Usuario] = useState<number | null>(null);
  const [fk_TipoActividad, setFk_TipoActividad] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState<"AS" | "CO" | "CA" | "">("");
  const [tipoActividadModal, setTipoActividadModal] = useState(false)

  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { data: tiposActividad, isLoading: isLoadingTiposActividad, refetch:refetchTipoActividad  } = useGetTipoActividad();
  const { mutate, isPending } = usePostActividades();

  const handleSubmit = () => {
    if (!fk_Cultivo || !fk_Usuario || !fk_TipoActividad || !titulo || !descripcion || !fecha || !estado) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Cultivo, fk_Usuario, fk_TipoActividad, titulo, descripcion, fecha, estado },
      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
          setFk_Usuario(null);
          setFk_TipoActividad(null);
          setTitulo("");
          setDescripcion("");
          setFecha("");
          setEstado("");
        },
      }
    );
  };
  const handleTipoActividadCreada = (nuevoTipoActividad : TipoActividad) => {
    refetchTipoActividad()
    setFk_TipoActividad(nuevoTipoActividad.id)
    setTipoActividadModal(false)
  }

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Actividades"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "light",
            onClick: handleSubmit,
          },
        ]}
      >
        <Input
          label="Titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <Input
          label="Descripción"
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <Input
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        {/* Selector de Estado con valores fijos */}
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

        {/* Selector de Cultivos */}
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

        {/* Selector de Usuarios (corregido) */}
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
        ): (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
              label="Tipo Actividad"
              placeholder="Seleccione el tipo de actividad"
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
            </div>
            <Button
            onPress={() => setTipoActividadModal(true)}
            color="success"
            title="Crear nuevo tipo de actividad"
            radius="full"
            size="sm"
            >
              <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
      </ModalComponent>
      {tipoActividadModal && (
        <CrearTipoActividadModal 
        onClose={() => setTipoActividadModal(false)}
        onCreate={handleTipoActividadCreada}
        />
      )}
    </>
  );
};
