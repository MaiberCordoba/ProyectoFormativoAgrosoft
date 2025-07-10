import React, { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchCultivos } from "../../hooks/cultivos/usePatchCultivos";
import { Cultivo } from "../../types";
import { Input, Select, SelectItem, Switch, Button } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { addToast } from "@heroui/toast";

interface EditarCultivoModalProps {
  cultivo: Cultivo;
  onClose: () => void;
}

const EditarCultivoModal: React.FC<EditarCultivoModalProps> = ({
  cultivo,
  onClose,
}) => {
  const [nombre, setNombre] = useState<string>("");
  const [fk_EspecieId, setFk_EspecieId] = useState<number | null>(null);
  const [selectedSpeciesKeys, setSelectedSpeciesKeys] = useState<Set<string>>(
    new Set()
  );
  const [activo, setActivo] = useState<boolean>(true);
  const [img, setImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(cultivo.img || "");

  const { mutate, isPending } = usePatchCultivos();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();

  useEffect(() => {
    if (!cultivo) return;
    setNombre(cultivo.nombre ?? "");
    const especieId = cultivo.fk_Especie;
    setFk_EspecieId(especieId ?? null);
    setActivo(!!cultivo.activo);
    setPreview(cultivo.img || "");
  }, [cultivo]);

  useEffect(() => {
    if (!isLoadingEspecies && fk_EspecieId !== null) {
      setSelectedSpeciesKeys(new Set([String(fk_EspecieId)]));
    }
  }, [isLoadingEspecies, fk_EspecieId]);

  const handleSubmit = () => {
    if (!nombre.trim() || !fk_EspecieId || cultivo.id === undefined) {
      addToast({
        title: "Campos obligatorios",
        description: "Por favor completa el nombre y selecciona una especie.",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("fk_Especie", fk_EspecieId.toString());
    formData.append("activo", activo.toString());
    if (img) {
      formData.append("img", img);
    }

    mutate(
      {
        id: cultivo.id,
        data: formData,
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
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Nombre */}
      <Input
        value={nombre}
        label="Nombre del Cultivo"
        size="sm"
        onChange={(e) => setNombre(e.target.value)}
      />

      {/* Especie */}
      {isLoadingEspecies ? (
        <p>Cargando especies…</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          size="sm"
          selectedKeys={selectedSpeciesKeys}
          onSelectionChange={(keys) => {
            const id = Array.from(keys)[0];
            if (id) setFk_EspecieId(Number(id));
          }}
        >
          {(especies || []).map((esp) => (
            <SelectItem key={esp.id.toString()}>{esp.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Imagen */}
      <div className="mt-4">
        <Button
          type="button"
          variant="solid"
          onPress={() => document.getElementById("imgInput")?.click()}
        >
          Cambiar imagen
        </Button>

        <input
          id="imgInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImg(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
      </div>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Vista previa"
            className="w-48 h-48 object-cover rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* Activo / Inactivo */}
      <div className="flex items-center gap-4 mt-4">
        <Switch
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          color="success"
        >
          {activo ? "Activo" : "Inactivo"}
        </Switch>
      </div>
    </ModalComponent>
  );
};

export default EditarCultivoModal;