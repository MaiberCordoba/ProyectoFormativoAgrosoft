import { useState } from "react";
import { login } from "@/api/Auth";
import { useAuth } from "@/hooks/UseAuth";
import { useNavigate } from "react-router-dom";
import FormComponent from "@/components/Form";
import logo from "../../public/sena.png"; // Logo principal 
import sideLogo from "../../public/logoAgrosoft.png"; // Logo del panel lateral


const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();
  
    const handleSubmit = async (data: Record<string, any>) => {
      setErrorMessage(""); // Limpiar errores previos
      try {
        const response = await login({ email: data.email, password: data.password });
        authLogin(response.access);
        navigate("/");
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
            <path
              fill="#008550"
              d="M0,1 C400,200 800,8 1440,18 L1440,320 L0,320 Z"
            />
          </svg>
        </div>
  
        {/* Contenedor principal  */}
        <div className="relative flex bg-white shadow-lg rounded-2xl w-[750px] h-[400px] max-w-full overflow-hidden z-10">
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
            {errorMessage && (
              <p className="text-red-500 text-sm font-semibold text-center mt-3">{errorMessage}</p>
            )}
          </div>
  
          {/* Panel derecho con gris más claro y elementos más grandes */}
          <div className="w-1/2 bg-[#D9D9D9] flex flex-col items-center justify-center text-black p-10">
            <img src={sideLogo} alt="agrosoftLogo" className="w-[250px] mb-7" />
            <p className="text-center font-semibold text-lg">¡Descarga la App Móvil!</p>
            <img src="../../public/googlePlay.png" alt="Descargar en Google Play" className="mt-5 w-44" />
          </div>
        </div>
  
        {/* Logo inferior izquierdo más grande */}
        <img src={logo} alt="Logo" className="absolute bottom-6 left-6 w-24" />
      </div>
    );
  };
  
  export default Login;