import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchPlantaciones } from "../../hooks/plantaciones/usePatchPlantaciones";
import { Plantaciones } from "../../types";
import { Select, SelectItem } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { useGetEras } from "../../hooks/eras/useGetEras";

interface EditarPlantacionModalProps {
  plantacion: Plantaciones;
  onClose: () => void;
}

const EditarPlantacionModal: React.FC<EditarPlantacionModalProps> = ({ plantacion, onClose }) => {
  const [fk_Especie, setFk_Especie] = useState<number>(plantacion.fk_Especie);
  const [fk_Era, setFk_Era] = useState<number>(plantacion.fk_Era);

  const { mutate, isPending } = usePatchPlantaciones();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();
  const { data: eras, isLoading: isLoadingEras } = useGetEras();

  const handleSubmit = () => {
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
          selectedKeys={fk_Especie ? [fk_Especie.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Especie(Number(selectedKey));
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
          selectedKeys={fk_Era ? [fk_Era.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Era(Number(selectedKey));
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
