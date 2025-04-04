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
  const [tiempocrecimiento, setTiempocrecimiento] = useState<number>(especie.tiempocrecimiento);
  const [fk_tipoespecie, setFk_TipoEspecie] = useState<number>(especie.fk_tipoespecie ?? 0); // 🔥 Corregido nombre

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
          tiempocrecimiento,
          fk_tipoespecie, // 🔥 Corregido para coincidir con el backend
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
          selectedKeys={fk_tipoespecie ? [fk_tipoespecie.toString()] : []} // 🔥 Se asegura de convertirlo a string
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; // 🔥 Extrae el valor seleccionado
            setFk_TipoEspecie(Number(selectedKey)); // 🔥 Convierte el valor seleccionado a número
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
