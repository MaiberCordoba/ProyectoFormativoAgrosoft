import { useState } from "react";
import { useRegisterUser } from "@/modules/Users/hooks/useRegisterUsers";
import { Link } from "@heroui/react";
import FormComponent from "@/components/Form";

const UserRegister = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const mutation = useRegisterUser();

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage("");
    try {
      await mutation.mutateAsync({
        nombre: data.nombre,
        apellidos: data.apellidos,
        identificacion: data.identificacion,
        fechaNacimiento: data.fechaNacimiento,
        telefono: data.telefono,
        correoElectronico: data.correoElectronico,
        password: data.password, // Asegúrate de que el backend lo reciba
        admin: data.admin === "true",
      });
      alert("Usuario registrado con éxito");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrorMessage("Hubo un error al registrar el usuario.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
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
            { name: "admin", label: "Admin", type: "checkbox" },
          ]}
          onSubmit={handleSubmit}
          submitLabel="Registrarse"
        />
        
        {/* Enlace al login */}
        <div className="mt-4 text-center">
          <Link 
            href="/login" 
            size="sm" 
            className="text-blue-500 hover:text-blue-700"
            underline="hover"
          >
            Volver al login
          </Link>
        </div>
        
        {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default UserRegister;
