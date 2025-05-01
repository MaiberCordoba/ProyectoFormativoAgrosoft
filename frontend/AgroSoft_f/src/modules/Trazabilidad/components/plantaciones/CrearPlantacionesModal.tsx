import { useState } from "react";
import { usePostPlantaciones } from "../../hooks/plantaciones/usePostPlantaciones";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { useGetEras } from "../../hooks/eras/useGetEras";
import ModalComponent from "@/components/Modal";
import { Select, SelectItem } from "@heroui/react";

interface CrearPlantacionModalProps {
  onClose: () => void;
}

export const CrearPlantacionModal = ({ onClose }: CrearPlantacionModalProps) => {
  const [fk_Especie, setFk_Especie] = useState<number | null>(null);
  const [fk_Era, setFk_Era] = useState<number | null>(null);

  const { mutate, isPending } = usePostPlantaciones();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();
  const { data: eras, isLoading: isLoadingEras } = useGetEras();

  const handleSubmit = () => {
    if (!fk_Especie || !fk_Era) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { fk_Especie, fk_Era },
      {
        onSuccess: () => {
          onClose();
          setFk_Especie(null);
          setFk_Era(null);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Plantación"
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
