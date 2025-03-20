import { useState } from "react";
import { useRegisterUser } from "@/modules/Users/hooks/useRegisterUsers";
import { Link, Card } from "@heroui/react";
import FormComponent from "@/components/Form";

const UserRegister = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = useRegisterUser();

  const handleSubmit = async (formData: Record<string, any>) => {
    setErrorMessage("");

    const adminValue = formData.admin === "true"; // Convierte string a booleano

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
    console.log("Datos del formulario:", payload);

    try {
      await mutation.mutateAsync(payload);
      alert("Usuario registrado con éxito");
    } catch (error) {
      setErrorMessage("Hubo un error al registrar el usuario.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Registro de Usuario</h2>
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

        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </Card>
    </div>
  );
};

export default UserRegister;