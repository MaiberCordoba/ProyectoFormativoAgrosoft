import { useState } from "react";
import { login, getUser } from "@/api/Auth";
import { useAuth } from "@/hooks/UseAuth";
import { useNavigate } from "react-router-dom";
import FormComponent from "@/components/Form";
import logo from "../../public/sena.png"; 
import { Link } from "@heroui/react";
import { CrearUsersModal } from "@/modules/Users/components/CrearUsersModal";
import { SolicitarRecuperacionModal } from "@/modules/Users/components/recuperaciones/solicitarRecuperacion";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const [registerModalUsers, setRegisterModalUsers] = useState(false)
  const [solicitarRecuperacion, setSolicitarRecuperacion] = useState(false)

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage("");
    try {
      const response = await login({ email: data.email, password: data.password });
      const userData = await getUser(response.access);
      localStorage.setItem("token", response.access);
      localStorage.setItem("user", JSON.stringify(userData));
      authLogin(response.access);
      navigate("/home");
    } catch (error) {
      console.error("Error de autenticación:", error);
      setErrorMessage("Correo o contraseña incorrectos. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <div
        className="h-screen w-full flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: 'url("/ImagenHome.JPG")' }}
      >
        {/* Capa de fondo semi-transparente */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        {/* Contenedor principal centrado */}
        <div className="relative z-10 flex items-center justify-center w-[400px] min-h-[500px] rounded-xl shadow-xl bg-white bg-opacity-10 backdrop-blur-lg p-10 text-white">
          <div className="w-full flex flex-col items-center">
            {/* Logo arriba */}
            <img src={logo} alt="Logo SENA" className="w-16 h-16 mb-4" />

            <h2 className="text-2xl font-semibold mb-4 text-center">Bienvenido de vuelta</h2>
            <p className="text-sm mb-4 text-gray-300 text-center">Por favor, introduce tus credenciales</p>

            <FormComponent
              fields={[
                { name: "email", label: "Correo", type: "email", required: true },
                { name: "password", label: "Contraseña", type: "password", required: true },
              ]}
              onSubmit={handleSubmit}
              submitLabel="Iniciar"
            />

            {/* Enlace de recuperación */}
            <div className="flex justify-between items-center w-full mt-2 text-xs text-gray-300">
              <Link onPress={() => setSolicitarRecuperacion(true)} underline="hover" className="text-white hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-red-500 text-sm font-semibold text-center mt-3">{errorMessage}</p>
            )}

            {/* Botón */}
            <button
              type="submit"
              onClick={() => document.querySelector("form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))}
              className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-opacity-80 transition"
            >
              Iniciar sesión
            </button>

            {/* Registro */}
            <p className="mt-4 text-center text-xs text-gray-300">
              ¿No tienes una cuenta?{" "}
              <Link onPress={() => setRegisterModalUsers(true)} underline="hover" className="text-white hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modales */}
      {registerModalUsers && (
        <CrearUsersModal onClose={() => setRegisterModalUsers(false)} />
      )}
      {solicitarRecuperacion && (
        <SolicitarRecuperacionModal onClose={() => setSolicitarRecuperacion(false)} />
      )}
    </>
  );
};

export default Login;
