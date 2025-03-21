import { useState } from "react"; 
import { useRegisterLotes } from "@/modules/Trazabilidad/hooks/useHooks";
import { Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";  
import FormComponent from "@/components/Form";

const LoteRegister = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = useRegisterLotes();
  const navigate = useNavigate();  

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage("");
    try {
      await mutation.mutateAsync({
        nombre: data.nombre,
        descripcion: data.descripcion,
        tamX: data.tamX,
        tamY: data.tamY,
        estado: data.estado,
        posX: data.posX,
        posY: data.posY,
      });
      alert("Lote registrado con éxito");
      navigate("/lote");  
    } catch (error) {
      console.error("Error al registrar lote:", error);
      setErrorMessage("Hubo un error al registrar el lote.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de Lote</h2>
        <FormComponent
          fields={[
            { name: "nombre", label: "Nombre", required: true },
            { name: "descripcion", label: "Descripción", type: "textarea", required: true },
            { name: "tamX", label: "Tamaño X", type: "number", required: true },
            { name: "tamY", label: "Tamaño Y", type: "number", required: true },
            { name: "estado", label: "Estado", type: "checkbox" },
            { name: "posX", label: "Posición X", type: "number", required: true },
            { name: "posY", label: "Posición Y", type: "number", required: true }
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrar Lote"
        />

        {/* Enlace a la lista de lotes */}
        <div className="mt-4 text-center">
          <Link 
            href="/lote" 
            size="sm" 
            className="text-blue-500 hover:text-blue-700"
            underline="hover"
          >
            Volver a la lista de lotes
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoteRegister;
