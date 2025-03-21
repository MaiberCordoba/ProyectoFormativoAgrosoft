import { useState } from "react"; 
import { useRegisterEspecie } from "@/modules/Trazabilidad/hooks/useHooks";
import { Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";  
import FormComponent from "@/components/Form";

const EspecieRegister = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = useRegisterEspecie();
  const navigate = useNavigate();  

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage("");
    try {
      await mutation.mutateAsync({
        fk_TiposEspecie: data.fk_TipoEspecie,
        nombre: data.nombre,
        descripcion: data.descripcion,
        img: data.img,
        tiempoCrecimiento: data.tiempoCrecimiento,
      });
      alert("Especie registrada con éxito");
      navigate("/especies");  
    } catch (error) {
      console.error("Error al registrar especie:", error);
      setErrorMessage("Hubo un error al registrar la especie.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de Especie</h2>
        <FormComponent
          fields={[
            { name: "fk_TiposEspecie", label: "Tipo de Especie", required: true },
            { name: "nombre", label: "Nombre", required: true },
            { name: "descripcion", label: "Descripción", type: "textarea", required: true },
            { name: "img", label: "Imagen (URL)", type: "text" },
            { name: "tiempoCrecimiento", label: "Tiempo de Crecimiento (días)", type: "number", required: true }
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrar Especie"
        />

        {/* Enlace a la lista de especies */}
        <div className="mt-4 text-center">
          <Link 
            href="/especies" 
            size="sm" 
            className="text-blue-500 hover:text-blue-700"
            underline="hover"
          >
            Volver a la lista de especies
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default EspecieRegister;
