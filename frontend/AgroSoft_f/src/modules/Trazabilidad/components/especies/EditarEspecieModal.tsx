import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchEspecies } from "../../hooks/especies/usePatchEspecies";
import { Especies } from "../../types";
import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";

interface EditarEspecieModalProps {
  especie: Especies;
  onClose: () => void;
}

const EditarEspecieModal: React.FC<EditarEspecieModalProps> = ({ especie, onClose }) => {
  const [nombre, setNombre] = useState<string>(especie.nombre);
  const [descripcion, setDescripcion] = useState<string>(especie.descripcion);
  const [img, setImg] = useState(especie.img || "");
  const [variedad, setVariedad] = useState(especie.variedad || ""); // ✅ Nuevo estado
  const [tiempocrecimiento, setTiempocrecimiento] = useState<number>(especie.tiempocrecimiento);
  const [fk_tipoespecie, setFk_TipoEspecie] = useState<number>(especie.fk_tipoespecie ?? 0);

  const { mutate, isPending } = usePatchEspecies();
  const { data: tiposEspecie, isLoading: isLoadingTiposEspecie } = useGetTiposEspecie();

  const handleSubmit = () => {
    mutate(
      {
        id: especie.id,
        data: {
          nombre,
          descripcion,
          img,
          variedad, // ✅ Se incluye variedad
          tiempocrecimiento,
          fk_tipoespecie,
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
      title="Editar Especie"
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

      <Textarea
        value={descripcion}
        label="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <Input
        value={img}
        label="Imagen (URL)"
        type="text"
        onChange={(e) => setImg(e.target.value)}
      />

      <Input
        value={variedad}
        label="Variedad"
        type="text"
        onChange={(e) => setVariedad(e.target.value)} // ✅ Campo de variedad editable
      />

      <Input
        label="Tiempo de Crecimiento (días)"
        type="number"
        value={tiempocrecimiento.toString()}
        onChange={(e) => setTiempocrecimiento(Number(e.target.value))}
      />

      {isLoadingTiposEspecie ? (
        <p>Cargando tipos de especie...</p>
      ) : (
        <Select
          label="Tipo de Especie"
          placeholder="Selecciona un tipo"
          selectedKeys={fk_tipoespecie ? [fk_tipoespecie.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_TipoEspecie(Number(selectedKey));
          }}
        >
          {(tiposEspecie || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()} value={tipo.id.toString()}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarEspecieModal;
