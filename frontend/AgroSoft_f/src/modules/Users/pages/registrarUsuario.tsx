import { useState } from "react";
import { useRegisterUser } from "@/modules/Users/hooks/useRegisterUsers";
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
    <div>
      <h2>Registro de Usuario</h2>
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
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default UserRegister;
