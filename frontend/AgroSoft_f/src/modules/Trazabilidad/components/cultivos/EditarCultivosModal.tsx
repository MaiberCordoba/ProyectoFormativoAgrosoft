import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchCultivos } from "../../hooks/cultivos/usePatchCultivos";
import { Cultivo } from "../../types";
import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";

interface EditarCultivoModalProps {
  cultivo: Cultivo;
  onClose: () => void;
}

const EditarCultivoModal: React.FC<EditarCultivoModalProps> = ({ cultivo, onClose }) => {
  const [nombre, setNombre] = useState<string>(cultivo.nombre);
  const [fk_Especie, setFk_Especie] = useState<{ nombre: string }>(cultivo.fk_Especie);
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
        label="Nombre del Cultivo"
        onChange={(e) => setNombre(e.target.value)}
      />

      {isLoadingEspecies ? (
        <p>Cargando especies...</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          selectedKeys={fk_Especie?.nombre ? [fk_Especie.nombre] : []}
          onSelectionChange={(keys) => {
            const selectedName = Array.from(keys)[0];
            if (selectedName) {
              setFk_Especie({ nombre: selectedName });
            }
          }}
        >
          {(especies || []).map((especie) => (
            <SelectItem key={especie.nombre}>{especie.nombre}</SelectItem>
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
