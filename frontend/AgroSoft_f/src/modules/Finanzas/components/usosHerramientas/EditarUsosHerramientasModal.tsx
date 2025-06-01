import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchUsosHerramientas } from "../../hooks/usosHerramientas/usePatchUsosHerramientas";
import { UsosHerramientas } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";

interface EditarUsoHerramientaModalProps {
  usoHerramienta: UsosHerramientas; // El uso de herramienta que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarUsoHerramientaModal: React.FC<EditarUsoHerramientaModalProps> = ({ usoHerramienta, onClose }) => {
  const [fk_Herramienta, setFk_Herramienta] = useState<number>(usoHerramienta.fk_Herramienta || 0);
  const [fk_Actividad, setFk_Actividad] = useState<number>(usoHerramienta.fk_Actividad || 0);
  const [unidades, setUnidades] = useState(usoHerramienta.unidades);
  const [error, setError] = useState("");

  const { data: herramientas, isLoading: isLoadingHerramientas } = useGetHerramientas();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { mutate, isPending } = usePatchUsosHerramientas();

  const handleSubmit = () => {
    if (unidades < 0 ){
      setError("La cantidad no puede ser negativa")
      return
    }
    mutate(
      {
        id: usoHerramienta.id,
        data: {
          fk_Herramienta,
          fk_Actividad,
          unidades
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
      title="Editar Uso de Herramienta"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>
      <Input
        label="Cantidad Usada"
        value={unidades.toString()}
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
        required
      />
      {/* Selector de Herramientas */}
      {isLoadingHerramientas ? (
        <p>Cargando herramientas...</p>
      ) : (
        <Select
          label="Herramienta"
          placeholder="Selecciona una herramienta"
          selectedKeys={[fk_Herramienta.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Herramienta(Number(selectedKey));
          }}
        >
          {(herramientas || []).map((herramienta) => (
            <SelectItem key={herramienta.id.toString()}>{herramienta.nombre}</SelectItem>
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
          selectedKeys={[fk_Actividad.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Actividad(Number(selectedKey));
          }}
        >
          {(actividades || []).map((actividad) => (
            <SelectItem key={actividad.id.toString()}>{actividad.titulo}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarUsoHerramientaModal;
