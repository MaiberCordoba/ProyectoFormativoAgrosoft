import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { usePostActividades } from "@/modules/Finanzas/hooks/useActividades";
import { Link } from "@heroui/react";
import FormComponentF from "@/modules/Finanzas/components/FormF";

const RegistrarActividad = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = usePostActividades();
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleSubmit = async (formData: Record<string, any>) => {
    setErrorMessage("");

    const payload = {
      fk_Cultivo: formData.fk_Cultivo,
      fk_Usuario: formData.fk_Usuario,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
      estado: formData.estado,
    };

    console.log("Datos del formulario:", payload);

    try {
      await mutation.mutateAsync(payload);
      alert("Actividad registrada con éxito");
      navigate("/actividades"); // Redirige a la lista de actividades
    } catch (error) {
      setErrorMessage("Hubo un error al registrar la actividad.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de actividades</h2>
        <FormComponentF
          fields={[
            { name: "fk_Cultivo", label: "Cultivo", required: true },
            { name: "fk_Usuario", label: "Usuario", required: true },
            { name: "titulo", label: "Titulo", required: true },
            { name: "descripcion", label: "Descripcion", required: true },
            { name: "fecha", label: "Fecha", type: "date", required: true },
            {
              name: "estado",
              label: "Estado",
              options: [
                { value: "SA", label: "Asignada" },
                { value: "CA", label: "Cancelada" },
                { value: "CO", label: "Completada" },
              ] as { value: string; label: string }[],
              required: true,
            },
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrar Actividad"
        />

        <div className="mt-4 text-center">
          <Link href="/actividades" size="sm" className="text-primary" underline="hover">
            Lista de actividades
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RegistrarActividad;
