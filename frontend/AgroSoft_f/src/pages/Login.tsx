import { useState } from "react";
import { login, getUser } from "@/api/Auth";
import { useAuth } from "@/hooks/UseAuth";
import { useNavigate } from "react-router-dom";
import FormComponent from "@/components/Form";
import logo from "../../public/sena.png"; 
import sideLogo from "../../public/logoAgrosoft.png";
import { Link } from "@heroui/react";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage(""); // Limpiar errores previos
    try {
      const response = await login({ email: data.email, password: data.password });
  
      // Obtener los datos del usuario
      const userData = await getUser(response.access);
      
      // Guardar usuario y token en localStorage
      localStorage.setItem("token", response.access);
      localStorage.setItem("user", JSON.stringify(userData));
  
      authLogin(response.access); // Autenticar
      navigate("/home"); // Redirigir a Home
  
    } catch (error) {
      console.error("Error de autenticación:", error);
      setErrorMessage("Correo o contraseña incorrectos. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-white">
      {/* Fondo con línea verde */}
      <div className="absolute bottom-0 left-0 w-full h-auto">
        <svg viewBox="0 0 1440 320" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <path fill="#008550" d="M0,1 C400,200 800,8 1440,18 L1440,320 L0,320 Z" />
        </svg>
      </div>

      {/* Contenedor principal */}
      <div className="relative flex bg-white shadow-lg rounded-2xl w-[600px] h-[350px] max-w-full overflow-hidden z-10">
        {/* Formulario */}
        <div className="w-1/2 p-10">
          <h2 className="text-xl font-semibold mb-6 text-center">¡Bienvenido de vuelta!</h2>
          <FormComponent
            fields={[
              {
                name: "email",
                label: "Correo electrónico",
                type: "email",
                placeholder: "Ingresa tu correo",
                required: true,
              },
              {
                name: "password",
                label: "Contraseña",
                type: "password",
                placeholder: "Ingresa tu contraseña",
                required: true,
              },
            ]}
            onSubmit={handleSubmit}
            submitLabel="Iniciar sesión"
          />
          
          {/* Enlaces adicionales debajo del formulario */}
          <div className="mt-1 text-left ">
            <Link href="/forgot-password" size="sm" style={{ fontSize: "10px" }} underline="hover" className="text-blue-500 hover:text-blue-700">
              ¿Olvidaste tu contraseña?
            </Link>
            <br />
            <Link href="/registro" size="sm" style={{ fontSize: "10px" }} underline="hover" className="text-blue-500 hover:text-blue-700">
              ¿Nuevo? Regístrate aquí
            </Link>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm font-semibold text-center mt-3">{errorMessage}</p>
          )}
        </div>

        {/* Panel derecho con gris más claro */}
        <div className="w-1/2 bg-[#D9D9D9] flex flex-col items-center justify-center text-black p-10">
          <img src={sideLogo} alt="AgroSoft Logo" className="w-[190px] mb-7" />
          <p className="text-center font-semibold text-lg">¡Descarga la App Móvil!</p>
          <img src="../../public/googlePlay.png" alt="Descargar en Google Play" className="mt-4 w-40" />
        </div>
      </div>

      {/* Logo inferior izquierdo más grande */}
      <img src={logo} alt="Logo" className="w-[90px] absolute bottom-6 left-4" />
    </div>
  );
};

export default Login;
