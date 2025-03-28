import { useState } from "react";
import { usePostEspecies } from "../../hooks/especies/usePostEspecies";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";

interface CrearEspecieModalProps {
  onClose: () => void;
}

export const CrearEspecieModal = ({ onClose }: CrearEspecieModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [img, setImg] = useState("");
  const [tiempocrecimiento, settiempocrecimiento] = useState<number | "">("");
  const [fk_TiposEspecie, setFk_TiposEspecie] = useState<number | null>(null);

  const { mutate, isPending } = usePostEspecies();
  const { data: tiposEspecie, isLoading: isLoadingTiposEspecie } = useGetTiposEspecie();

  const handleSubmit = () => {
    if (!nombre || !descripcion || !img || !tiempocrecimiento || !fk_TiposEspecie) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { nombre, descripcion, img, tiempocrecimiento: Number(tiempocrecimiento), fk_TiposEspecie },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
          setImg("");
          settiempocrecimiento("");
          setFk_TiposEspecie(null);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Especie"
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
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />

      <Input
        label="Imagen"
        type="text"
        value={img}
        onChange={(e) => setImg(e.target.value)}
        required
      />

      <Input
        label="Tiempo de Crecimiento"
        type="number"
        value={tiempocrecimiento.toString()} // Convierte el número a string
        onChange={(e) => settiempocrecimiento(Number(e.target.value))} // Convierte de vuelta a número
      />


      {isLoadingTiposEspecie ? (
        <p>Cargando tipos de especie...</p>
      ) : (
        <Select
          label="Tipo de Especie"
          placeholder="Selecciona un tipo"
          selectedKeys={fk_TiposEspecie ? [fk_TiposEspecie.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_TiposEspecie(Number(selectedKey));
          }}
        >
          {(tiposEspecie || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
