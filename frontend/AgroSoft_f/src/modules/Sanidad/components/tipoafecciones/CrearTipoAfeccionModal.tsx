import { useState } from "react";
import { usePostTipoAfeccion } from "../../hooks/tiposAfecciones/usePostTipoAfecciones";
import ModalComponent from "@/components/Modal";
import { Button, Input } from "@heroui/react";

interface CrearTipoAfeccionModalProps {
  onClose: () => void;
  onCreate: (nuevoTipo: { id: number; nombre: string }) => void; // Nuevo prop para retornar el tipo creado
}

export const CrearTipoAfeccionModal = ({ onClose,onCreate }: CrearTipoAfeccionModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [img, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate, isPending } = usePostTipoAfeccion();

  const handleSubmit = () => {
    if (!nombre || !descripcion || !img) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    //MANEJO DE FORDATA PARA MANEJO DE IMAGENES
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("img", img); // este debe ser el mismo nombre que espera el backend
  
    mutate(formData, {
      onSuccess: (data) => {
        onCreate({ id: data.id, nombre: data.nombre }); // ← Aquí envías el nuevo tipo al modal principal
        onClose();      // ← También puedes cerrar aquí, o dejar que el padre lo haga
        setNombre("");
        setDescripcion("");
        setImagen(null);
       
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de tipo de  afectaciones"
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

      <div className="mt-4">
        <Button
          type="submit"
          variant="solid"
          onPress={() => document.getElementById("imagenInput")?.click()}
        >
          Seleccionar imagen
        </Button>

      <input
        id="imagenInput"
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
  );
};