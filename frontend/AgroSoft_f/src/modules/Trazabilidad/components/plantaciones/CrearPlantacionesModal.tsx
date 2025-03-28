import { useState } from "react";
import { usePostPlantaciones } from "../../hooks/plantaciones/usePostPlantaciones";
import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useGetEras } from "../../hooks/eras/useGetEras";
import ModalComponent from "@/components/Modal";
import { Select, SelectItem } from "@heroui/react";

interface CrearPlantacionModalProps {
  onClose: () => void;
}

export const CrearPlantacionModal = ({ onClose }: CrearPlantacionModalProps) => {
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null);
  const [fk_Era, setFk_Era] = useState<number | null>(null);

  const { mutate, isPending } = usePostPlantaciones();
  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: eras, isLoading: isLoadingEras } = useGetEras();

  const handleSubmit = () => {
    if (!fk_Cultivo || !fk_Era) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { fk_Cultivo, fk_Era },
      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
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
      {/* Select de Cultivo */}
      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Cultivo(Number(selectedKey));
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id.toString()}>{cultivo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Select de Era (Usando el ID como nombre) */}
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
