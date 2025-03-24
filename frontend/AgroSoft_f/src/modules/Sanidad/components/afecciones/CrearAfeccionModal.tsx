import { useState } from "react";
import { usePostAfeccion } from "../../hooks/afecciones/usePostAfecciones";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, toast } from "@heroui/react";
import { useGetTipoAfecciones } from "../../hooks/tiposAfecciones/useGetTipoAfecciones";

interface CrearAfeccionModalProps {
  onClose: () => void;
}

export const CrearAfeccionModal = ({ onClose }: CrearAfeccionModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fk_Tipo, setFk_Tipo] = useState<number | null>(null); 
  const [img, setImg] = useState("")

  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } = useGetTipoAfecciones(); // Obtener los tipos de plaga
  const { mutate, isPending } = usePostAfeccion();

  const handleSubmit = () => {
    if (!nombre || !descripcion || !fk_Tipo) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      {nombre, descripcion, fk_Tipo, img }, // Envía el ID del tipo de plaga
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
          setImg("");
          setFk_Tipo(null); // Limpiar el selector
        },
        
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de afectaciones"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant:"light",
          onClick: handleSubmit
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

      {/* Selector de tipos de plaga con HeroUI */}
      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          selectedKeys={fk_Tipo ? [fk_Tipo.toString()] : []} // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
            setFk_Tipo(Number(selectedKey)); // Actualiza el estado con el nuevo ID
          }}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};