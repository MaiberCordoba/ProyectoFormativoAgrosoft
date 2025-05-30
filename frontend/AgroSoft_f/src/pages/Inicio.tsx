import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa"; // Importamos un ícono de flecha

export function Inicio() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/sensores");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: 'url("/ImagenHome.JPG")' }}
    >
      {/* Capa oscura semi-transparente sobre la imagen */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-10 h-[calc(100vh-96px)]">
        {/* Lado izquierdo: texto principal y botón */}
        <div className="text-white max-w-xl">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-4 uppercase">
            Agro<span style={{ color: "#327d45" }}>Soft</span> 
          </h1>
          <p className="text-gray-200 text-lg mb-8">
            Innovación tecnológica para el desarrollo del campo.
          </p>
          {/* Botón circular con ícono de flecha */}
          <button
            onClick={handleRedirect}
            className="flex items-center justify-center w-14 h-14 rounded-full text-white font-bold"
            style={{ backgroundColor: "#327d45" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#286838")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#327d45")}
          >
            <FaArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}