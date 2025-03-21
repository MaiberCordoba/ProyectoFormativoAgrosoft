import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { usePostDesechos } from "@/modules/Finanzas/hooks/useDesechos";
import { Link } from "@heroui/react";
import FormComponentF from "@/modules/Finanzas/components/FormF";

const RegistrarDesechos = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = usePostDesechos();
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleSubmit = async (formData: Record<string, any>) => {
    setErrorMessage("");

    const payload = {
      fk_Cultivo: formData.fk_Cultivo,
      fk_TipoDesecho: formData.fk_TipoDesecho,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    };

    console.log("Datos del formulario:", payload);

    try {
      await mutation.mutateAsync(payload);
      alert("Desecho registrado con éxito");
      navigate("/desechos"); // Redirige a la lista de actividades
    } catch (error) {
      setErrorMessage("Hubo un error al registrar el desecho.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de desechos</h2>
        <FormComponentF
          fields={[
            { name: "fk_Cultivo", label: "Cultivo(ID)", required: true },
            { name: "fk_TipoDesecho", label: "fk_TipoDesecho", required: true },
            { name: "nombre", label: "Nombre", required: true },
            { name: "descripcion", label: "Descripcion", required: true },
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrar Desecho"
        />

        <div className="mt-4 text-center">
          <Link href="/desechos" size="sm" className="text-primary" underline="hover">
            Lista de desechos
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RegistrarDesechos;
