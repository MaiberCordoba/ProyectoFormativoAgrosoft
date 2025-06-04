import React, { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchCultivos } from "../../hooks/cultivos/usePatchCultivos";
import { Cultivo } from "../../types";
import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { addToast } from "@heroui/toast";

interface EditarCultivoModalProps {
  cultivo: Cultivo;
  onClose: () => void;
}

const EditarCultivoModal: React.FC<EditarCultivoModalProps> = ({ cultivo, onClose }) => {
  const [nombre, setNombre] = useState<string>(cultivo?.nombre ?? "");
  const [fk_EspecieId, setFk_EspecieId] = useState<number | null>(
    cultivo?.fk_Especie?.id ?? null
  );
  const [activo, setActivo] = useState<boolean>(cultivo?.activo ?? true);

  const { mutate, isPending } = usePatchCultivos();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();

  useEffect(() => {
    if (!cultivo || !cultivo.fk_Especie) {
      console.warn("El cultivo o su especie no están definidos correctamente.");
    }
  }, [cultivo]);

  const handleSubmit = () => {
    if (!nombre || !fk_EspecieId || cultivo.id === undefined) {
      addToast({
        title: "Error en datos",
        description: "Nombre o especie no válidos.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        id: cultivo.id,
        data: {
          nombre,
          fk_Especie: fk_EspecieId,
          activo,
        },
      },
      {
        onSuccess: () => {
          addToast({
            title: "Actualización exitosa",
            description: "El cultivo fue actualizado correctamente.",
            color: "success",
          });
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error al actualizar",
            description: "No fue posible actualizar el cultivo.",
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
        size="sm"
        onChange={(e) => setNombre(e.target.value)}
      />

      {isLoadingEspecies ? (
        <p>Cargando especies...</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          size="sm"
          selectedKeys={
            fk_EspecieId ? new Set([fk_EspecieId.toString()]) : new Set()
          }
          onSelectionChange={(keys) => {
            const selectedId = Array.from(keys)[0];
            if (selectedId) {
              setFk_EspecieId(Number(selectedId));
            }
          }}
        >
          {(especies || []).map((especie) => (
            <SelectItem key={especie.id.toString()}>{especie.nombre}</SelectItem>
          ))}
        </Select>
      )}

      <div className="mt-4 flex items-center">
        <label className="mr-2">Estado: </label>
        <Switch isSelected={activo} onChange={(e) => setActivo(e.target.checked)}>
          {activo ? "Activo" : "Inactivo"}
        </Switch>
      </div>
    </ModalComponent>
  );
};

export default EditarCultivoModal;
