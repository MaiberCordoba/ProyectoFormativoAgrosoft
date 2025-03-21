import { useState, useEffect, useRef } from "react";
import { useRegisterUser } from "@/modules/Users/hooks/useRegisterUsers";
import { Link, Card, Alert } from "@heroui/react";
import FormComponent from "@/components/Form";

const UserRegister = () => {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const mutation = useRegisterUser();
  const alertRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (formData: Record<string, any>) => {
    setMessage(null); // Limpia cualquier mensaje anterior

    const adminValue = formData.admin === "true";

    const payload = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      identificacion: formData.identificacion,
      fechaNacimiento: formData.fechaNacimiento,
      telefono: formData.telefono,
      correoElectronico: formData.correoElectronico,
      password: formData.password,
      admin: adminValue,
    };

    try {
      await mutation.mutateAsync(payload);
      setMessage({ type: "success", text: "Usuario registrado con éxito" });
    } catch (error) {
      setMessage({ type: "error", text: "Hubo un error al registrar el usuario." });
    }
  };

  // Hace scroll automático cuando hay un mensaje
  useEffect(() => {
    if (message) {
      alertRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [message]);

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de Usuario</h2>

        {/* Contenedor de alertas con referencia */}
        <div ref={alertRef}>
          {message && (
            <Alert
              title={message.type === "success" ? "Éxito" : "Error"}
              description={message.text}
              className={message.type === "error" ? "text-red-500" : ""}
            />
          )}
        </div>

        <FormComponent
          fields={[
            { name: "nombre", label: "Nombre", required: true },
            { name: "apellidos", label: "Apellidos", required: true },
            { name: "identificacion", label: "Identificación", required: true },
            { name: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date", required: true },
            { name: "telefono", label: "Teléfono", required: true },
            { name: "correoElectronico", label: "Correo Electrónico", type: "email", required: true },
            { name: "password", label: "Contraseña", type: "password", required: true },
            {
              name: "admin",
              label: "¿Es Administrador?",
              options: [
                { key: "true", label: "Sí" },
                { key: "false", label: "No" },
              ],
              required: true,
            },
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrarse"
        />

        <div className="mt-4 text-center">
          <Link href="/login" size="sm" className="text-primary" underline="hover">
            Volver al login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default UserRegister;