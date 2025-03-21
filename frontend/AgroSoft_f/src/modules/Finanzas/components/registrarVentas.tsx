import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { usePostVentas } from "@/modules/Finanzas/hooks/useVentas";
import { Link, Alert } from "@heroui/react";
import FormComponentF from "@/modules/Finanzas/components/FormF";

const RegistrarVentas = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar la visibilidad de la alerta
  const mutation = usePostVentas();
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleSubmit = async (formData: Record<string, any>) => {
    setErrorMessage("");
    
    const payload = {
      fk_Cosecha: formData.fk_Cosecha,
      precioUnitario: formData.precioUnitario,
      fecha: formData.fecha,
    };

    console.log("Datos del formulario:", payload);

    try {
      await mutation.mutateAsync(payload);
      setMessage({ type: "success", text: "Venta registrada con éxito" });
      setShowAlert(true); // Mostrar alerta
      
      setTimeout(() => {
        setShowAlert(false); // Ocultar alerta antes de navegar
        navigate("/ventas"); // Redirigir después de la alerta
      }, 2000);
      
    } catch (error: any) {
      console.error("Error al registrar la venta:", error);
      setMessage({ type: "error", text: error.message || "Hubo un error al registrar la venta." });
      setShowAlert(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de ventas</h2>

        {showAlert && message && (
          <Alert
            title={message.type === "success" ? "Éxito" : "Error"}
            description={message.text}
            className={message.type === "error" ? "text-red-500" : ""}
          />
        )}

        <FormComponentF
          fields={[
            { name: "fk_Cosecha", label: "Cosecha", required: true },
            { name: "precioUnitario", label: "Precio Unitario", required: true },
            { name: "fecha", label: "Fecha", type: "date", required: true },
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrar Venta"
        />

        <div className="mt-4 text-center">
          <Link href="/ventas" size="sm" className="text-primary" underline="hover">
            Lista de ventas
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RegistrarVentas;
