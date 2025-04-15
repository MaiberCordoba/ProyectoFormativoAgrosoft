import { useState } from "react";
import { usePostAfeccion } from "../../hooks/afecciones/usePostAfecciones";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetTipoAfecciones } from "../../hooks/tiposAfecciones/useGetTipoAfecciones";
import { CrearTipoAfeccionModal } from "../tipoafecciones/CrearTipoAfeccionModal";
import { Plus } from "lucide-react";

interface CrearAfeccionModalProps {
  onClose: () => void;
  onCreate: (nuevoTipo: { id: number; nombre: string;  }) => void; // Nuevo prop para retornar el tipo creado

}

export const CrearAfeccionModal = ({ onClose, onCreate }: CrearAfeccionModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fk_Tipo, setFk_Tipo] = useState<number | null>(null); 
  const [img, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: tiposPlaga,refetch: refetchTiposPlaga } = useGetTipoAfecciones(); // Obtener los tipos de plaga
  const { mutate, isPending } = usePostAfeccion();

  // estado mostrar/ocultar del modal tipoAfeccion
  const [mostrarModalTipoAfeccion, setMostrarModalTipoAfeccion] = useState(false); 
  
  const handleSubmit = () => {
    if (!nombre || !descripcion || !fk_Tipo || !img) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("img",img);
    formData.append("fk_Tipo", fk_Tipo.toString());
    
    mutate(formData,{
        onSuccess: (data) => {
          onCreate({ id: data.id, nombre: data.nombre }); // ← Aquí envías el nuevo tipo al modal principal
          onClose();
          setNombre("");
          setDescripcion("");
          setImagen(null);
          setFk_Tipo(null); // Limpiar el selector
        },
        
      }
    );
  };

  const handleTipoAfeccionCreado = async (nuevoTipo: { id: number; nombre: string }) => {
    await refetchTiposPlaga(); // Recarga los tipos
    setFk_Tipo(nuevoTipo.id);  // Selecciona el nuevo automáticamente
    setMostrarModalTipoAfeccion(false); // Cierra el modal secundario
  };

  return (
    <>
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

<div className="flex items-center gap-2 mt-4">
  <div className="flex-1">
    <Select
      label="Tipo de Plaga"
      placeholder="Selecciona un tipo de plaga"
      selectedKeys={fk_Tipo ? [fk_Tipo.toString()] : []}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0];
        setFk_Tipo(Number(selectedKey));
      }}
    > 
      {(tiposPlaga || []).map((tipo) => (
        <SelectItem key={tipo.id.toString()}>
          {tipo.nombre}
        </SelectItem>
      ))}
    </Select>
  </div>

  <Button
    onPress={() => setMostrarModalTipoAfeccion(true)}
    color="success"
    title="Agregar nuevo tipo"
    radius="full"
    size="sm"
  >
    <Plus className="w-5 h-5 text-white" />
  </Button>
</div>

<div className="mt-4">
        <Button
          type="submit"
          variant="solid"
          onPress={() => document.getElementById("imagenAfecciones")?.click()}
        >
          Seleccionar imagen
        </Button>

      <input
        id="imagenAfecciones"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) 
            setImagen(file);
            setPreview(URL.createObjectURL(file!)); 
        }}
        className="hidden"
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
    </ModalComponent>

    {/*Modal secundario de tipo de afectación */}
    {mostrarModalTipoAfeccion && (
      <CrearTipoAfeccionModal
        onClose={() => setMostrarModalTipoAfeccion(false)}
        onCreate={handleTipoAfeccionCreado}
      />
    )}
    </>
  );
};