import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { usePostCosechas } from "@/modules/Finanzas/hooks/useCosechas";
import { Link } from "@heroui/react";
import FormComponentF from "@/modules/Finanzas/components/FormF";

const RegistrarCosecha = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = usePostCosechas();
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleSubmit = async (formData: Record<string, any>) => {
    setErrorMessage("");

    const payload = {
      fk_Cultivo: formData.fk_Cultivo,
      unidades: formData.unidades,
      fecha: formData.fecha,
    };

    console.log("Datos del formulario:", payload);

    try {
      await mutation.mutateAsync(payload);
      alert("Cosecha registrada con éxito");
      navigate("/cosechas"); 
    } catch (error) {
      setErrorMessage("Hubo un error al registrar la cosecha.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de cosechas</h2>
        <FormComponentF
          fields={[
            { name: "fk_Cultivo", label: "Cultivo", required: true },
            { name: "unidades", label: "Unidades", required: true },
            { name: "fecha", label: "Fecha", type: "date", required: true }
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrar Cosecha"
        />

        <div className="mt-4 text-center">
          <Link href="/cosechas" size="sm" className="text-primary" underline="hover">
            Lista de cosechas
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RegistrarCosecha;
