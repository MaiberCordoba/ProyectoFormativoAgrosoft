import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { usePostHerramientas } from "@/modules/Finanzas/hooks/useHerramientas";
import { Link } from "@heroui/react";
import FormComponentF from "@/modules/Finanzas/components/FormF";

const RegistrarHerramientas = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = usePostHerramientas();
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleSubmit = async (formData: Record<string, any>) => {
    setErrorMessage("");

    const payload = {
      fk_Lote: formData.fk_Lote,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      unidades: formData.unidades,
    };

    console.log("Datos del formulario:", payload);

    try {
      await mutation.mutateAsync(payload);
      alert("Herramienta registrada con éxito");
      navigate("/herramientas"); 
    } catch (error) {
      setErrorMessage("Hubo un error al registrar la herramienta.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de herramientas</h2>
        <FormComponentF
          fields={[
            { name: "fk_Lote", label: "Lote", required: true },
            { name: "nombre", label: "Nombre", required: true },
            { name: "descripcion", label: "Descripcion", required: true },
            { name: "unidades", label: "Unidades", required: true },
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrar Herramienta"
        />

        <div className="mt-4 text-center">
          <Link href="/herramientas" size="sm" className="text-primary" underline="hover">
            Lista de herramientas
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RegistrarHerramientas;
