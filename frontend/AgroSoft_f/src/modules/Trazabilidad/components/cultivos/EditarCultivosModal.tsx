import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchCultivos } from "../../hooks/cultivos/usePatchCultivos";
import { Cultivos } from "../../types";
import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";

interface EditarCultivoModalProps {
  cultivo: Cultivos;
  onClose: () => void;
}

const EditarCultivoModal: React.FC<EditarCultivoModalProps> = ({ cultivo, onClose }) => {
  const [nombre, setNombre] = useState<string>(cultivo.nombre);
  const [unidades, setUnidades] = useState<number>(cultivo.unidades);
  const [fechaSiembra, setFechaSiembra] = useState<string>(cultivo.fechaSiembra);
  const [fk_Especie, setFk_Especie] = useState<number>(cultivo.fk_Especie);
  const [activo, setActivo] = useState<boolean>(cultivo.activo);

  const { mutate, isPending } = usePatchCultivos();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();

  const handleSubmit = () => {
    if (cultivo.id === undefined) {
      console.error("Error: ID del cultivo es undefined");
      return;
    }

    mutate(
      {
        id: cultivo.id,
        data: {
          nombre,
          unidades,
          fechaSiembra,
          fk_Especie,
          activo,
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
      title="Editar Cultivo"
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
        value={nombre}
        label="Nombre"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
      />
      <Input
        value={unidades.toString()}
        label="Unidades"
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
      />
      <Input
        value={fechaSiembra}
        label="Fecha de Siembra"
        type="date"
        onChange={(e) => setFechaSiembra(e.target.value)}
      />

      {isLoadingEspecies ? (
        <p>Cargando especies...</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          selectedKeys={fk_Especie ? [fk_Especie.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            if (selectedKey) {
              setFk_Especie(Number(selectedKey));
            }
          }}
        >
          {(especies || []).map((especie) => (
            <SelectItem key={especie.id.toString()}>{especie.nombre}</SelectItem>
          ))}
        </Select>
      )}

      <div className="mt-4 flex items-center">
        <label className="mr-2">Activo:</label>
        <Switch isSelected={activo} onChange={(e) => setActivo(e.target.checked)} />
      </div>
    </ModalComponent>
  );
};

export default EditarCultivoModal;
