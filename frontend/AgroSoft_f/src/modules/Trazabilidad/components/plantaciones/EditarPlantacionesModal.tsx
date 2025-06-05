import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchPlantaciones } from "../../hooks/plantaciones/usePatchPlantaciones";
import { Plantaciones } from "../../types";
import { Select, SelectItem } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { useGetEras } from "../../hooks/eras/useGetEras";
import { addToast } from "@heroui/toast";

interface EditarPlantacionModalProps {
  plantacion: Plantaciones;
  onClose: () => void;
}

const EditarPlantacionModal: React.FC<EditarPlantacionModalProps> = ({ plantacion, onClose }) => {
  const [fk_Especie, setFk_Especie] = useState<number | null>(plantacion.fk_Especie ?? null);
  const [fk_Era, setFk_Era] = useState<number | null>(plantacion.fk_Era ?? null);

  const { mutate, isPending } = usePatchPlantaciones();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();
  const { data: eras, isLoading: isLoadingEras } = useGetEras();

  const handleSubmit = () => {
    if (fk_Especie === null || fk_Era === null) {
      addToast({
        title: "Campos obligatorios",
        description: "Por favor selecciona una especie y una era.",
        color: "warning",
      });
      return;
    }

    mutate(
      {
        id: plantacion.id,
        data: {
          fk_Especie,
          fk_Era,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No fue posible actualizar la plantación.",
            color: "danger",
          });
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Plantación"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Select de Especie */}
      {isLoadingEspecies ? (
        <p>Cargando especies...</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          size="sm"
          selectedKeys={fk_Especie ? new Set([fk_Especie.toString()]) : new Set()}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Especie(Number(selectedKey) || null);
          }}
        >
          {(especies || []).map((especie) => (
            <SelectItem key={especie.id.toString()}>{especie.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Select de Era */}
      {isLoadingEras ? (
        <p>Cargando eras...</p>
      ) : (
        <Select
          label="Era"
          placeholder="Selecciona una era"
          size="sm"
          selectedKeys={fk_Era ? new Set([fk_Era.toString()]) : new Set()}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Era(Number(selectedKey) || null);
          }}
        >
          {(eras || []).map((era) => (
            <SelectItem key={era.id.toString()}>{`Era ${era.id}`}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarPlantacionModal;
