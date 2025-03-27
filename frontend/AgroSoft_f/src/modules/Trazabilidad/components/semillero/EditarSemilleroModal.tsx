import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchSemilleros } from "../../hooks/semilleros/usePatchSemilleros";
import { Semilleros } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";

interface EditarSemilleroModalProps {
  semillero: Semilleros;
  onClose: () => void;
}

const EditarSemilleroModal: React.FC<EditarSemilleroModalProps> = ({ semillero, onClose }) => {
  const [unidades, setUnidades] = useState<number>(semillero.unidades);
  const [fechasiembra, setFechaSiembra] = useState<string>(semillero.fechasiembra);
  const [fechaestimada, setFechaEstimada] = useState<string>(semillero.fechaestimada);
  const [fk_especie, setFk_Especie] = useState<number>(semillero.fk_especie);

  const { mutate, isPending } = usePatchSemilleros();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();

  const handleSubmit = () => {
    mutate(
      {
        id: semillero.id,
        data: {
          unidades,
          fechasiembra,
          fechaestimada,
          fk_especie,
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
      title="Editar Semillero"
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
        value={unidades.toString()}
        label="Unidades"
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
      />
      <Input
        value={fechasiembra}
        label="Fecha de Siembra"
        type="date"
        onChange={(e) => setFechaSiembra(e.target.value)}
      />
      <Input
        value={fechaestimada}
        label="Fecha Estimada"
        type="date"
        onChange={(e) => setFechaEstimada(e.target.value)}
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

export default EditarSemilleroModal;
