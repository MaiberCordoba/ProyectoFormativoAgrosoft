import { useState } from "react";
import { usePostUsoHerramienta } from "../../hooks/usosHerramientas/usePostUsosHerramientas";
import ModalComponent from "@/components/Modal";
import { Select, SelectItem } from "@heroui/react";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";

interface CrearUsoHerramientaModalProps {
  onClose: () => void;
}

export const CrearUsoHerramientaModal = ({ onClose }: CrearUsoHerramientaModalProps) => {
  const [fk_Herramientas, setFk_Herramienta] = useState<number | null>(null);
  const [fk_Actividad, setFk_Actividad] = useState<number | null>(null);

  const { data: herramientas, isLoading: isLoadingHerramientas } = useGetHerramientas();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { mutate, isPending } = usePostUsoHerramienta();

  const handleSubmit = () => {
    if (!fk_Herramientas || !fk_Actividad) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Herramientas, fk_Actividad },
      {
        onSuccess: () => {
          onClose();
          setFk_Herramienta(null);
          setFk_Actividad(null);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registrar Uso de Herramienta"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Selector de Herramientas */}
      {isLoadingHerramientas ? (
        <p>Cargando herramientas...</p>
      ) : (
        <Select
          label="Herramienta"
          placeholder="Selecciona una herramienta"
          selectedKeys={fk_Herramientas ? [fk_Herramientas.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Herramienta(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(herramientas || []).map((herramienta) => (
            <SelectItem key={herramienta.id.toString()}>
              {herramienta.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Actividades */}
      {isLoadingActividades ? (
        <p>Cargando actividades...</p>
      ) : (
        <Select
          label="Actividad"
          placeholder="Selecciona una actividad"
          selectedKeys={fk_Actividad ? [fk_Actividad.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Actividad(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(actividades || []).map((actividad) => (
            <SelectItem key={actividad.id.toString()}>
              {actividad.titulo}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
