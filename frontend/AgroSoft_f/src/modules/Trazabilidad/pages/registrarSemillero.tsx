import { useState } from "react";
import { useRegisterSemillero } from "@/modules/Trazabilidad/hooks/useRegisterSemillero";
import { Link } from "@heroui/react";
import FormComponent from "@/components/Form";

const SemilleroRegister = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = useRegisterSemillero();

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage("");
    try {
      await mutation.mutateAsync({
        fk_Especie: data.fk_Especie,
        unidades: data.unidades,
        fechaSiembra: data.fechaSiembra,
        fechaEstimada: data.fechaEstimada,
      });
      alert("Semillero registrado con éxito");
    } catch (error) {
      console.error("Error al registrar semillero:", error);
      setErrorMessage("Hubo un error al registrar el semillero.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de Semillero</h2>
        <FormComponent
  fields={[
    { name: "fk_Especie", label: "Especie", required: true },
    { name: "unidades", label: "Unidades", type: "number", required: true },
    { name: "fechaSiembra", label: "Fecha de Siembra", type: "date", required: true },
    { name: "fechaEstimada", label: "Fecha Estimada", type: "date", required: true }
  ]}
  onSubmit={handleSubmit}
  submitLabel="Registrar Semillero"
/>

        
        {/* Enlace a la lista de semilleros */}
        <div className="mt-4 text-center">
          <Link 
            href="/semilleros" 
            size="sm" 
            className="text-blue-500 hover:text-blue-700"
            underline="hover"
          >
            Volver a la lista de semilleros
          </Link>
        </div>
        
        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SemilleroRegister;
