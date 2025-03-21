import { useState } from "react"; 
import { useRegisterCultivo } from "@/modules/Trazabilidad/hooks/useRegisterCultivo";
import { Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";  // <-- Importa useNavigate
import FormComponent from "@/components/Form";

const CultivoRegister = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = useRegisterCultivo();
  const navigate = useNavigate();  // <-- Hook para navegación

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage("");
    try {
      await mutation.mutateAsync({
        fk_especie: data.fk_especie,
        nombre: data.nombre,
        unidades: data.unidades,
        activo: data.activo,
        fechaSiembra: data.fechasiembra,
      });
      alert("Cultivo registrado con éxito");
      navigate("/cultivos");  // <-- Redirigir a la lista de cultivos
    } catch (error) {
      console.error("Error al registrar cultivo:", error);
      setErrorMessage("Hubo un error al registrar el cultivo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de Cultivo</h2>
        <FormComponent
          fields={[
            { name: "fk_especie", label: "Especie", required: true },
            { name: "nombre", label: "Nombre", required: true },
            { name: "unidades", label: "Unidades", type: "number", required: true },
            { name: "activo", label: "Activo", type: "checkbox" },
            { name: "fechaSiembra", label: "Fecha de Siembra", type: "date", required: true }
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrar Cultivo"
        />

        {/* Enlace a la lista de cultivos */}
        <div className="mt-4 text-center">
          <Link 
            href="/cultivos" 
            size="sm" 
            className="text-blue-500 hover:text-blue-700"
            underline="hover"
          >
            Volver a la lista de cultivos
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default CultivoRegister;
