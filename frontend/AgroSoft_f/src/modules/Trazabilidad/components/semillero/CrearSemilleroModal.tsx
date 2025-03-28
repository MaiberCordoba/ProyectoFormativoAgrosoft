import { useState } from "react";
import { usePostSemilleros } from "../../hooks/semilleros/usePostSemilleros";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";

interface CrearSemilleroModalProps {
  onClose: () => void;
}

export const CrearSemilleroModal = ({ onClose }: CrearSemilleroModalProps) => {
  const [unidades, setUnidades] = useState<number | "">("");
  const [fechasiembra, setFechaSiembra] = useState<string>("");
  const [fechaestimada, setFechaEstimada] = useState<string>("");
  const [fk_especie, setFk_Especie] = useState<number | null>(null);

  const { mutate, isPending } = usePostSemilleros();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();

  const handleSubmit = () => {
    if (!unidades || !fechasiembra || !fechaestimada || !fk_especie) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { unidades: Number(unidades), fechasiembra, fechaestimada, fk_especie },
      {
        onSuccess: () => {
          onClose();
          setUnidades("");
          setFechaSiembra("");
          setFechaEstimada("");
          setFk_Especie(null);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Semillero"
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
        label="Unidades"
        type="number"
        value={unidades.toString()} 
        onChange={(e) => setUnidades(Number(e.target.value))}
        required
      />

      <Input
        label="Fecha de Siembra"
        type="date"
        value={fechasiembra}
        onChange={(e) => setFechaSiembra(e.target.value)}
        required
      />

      <Input
        label="Fecha Estimada"
        type="date"
        value={fechaestimada}
        onChange={(e) => setFechaEstimada(e.target.value)}
        required
      />

      {isLoadingEspecies ? (
        <p>Cargando especies...</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          selectedKeys={fk_especie ? [fk_especie.toString()] : []}
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
    </ModalComponent>
  );
};
