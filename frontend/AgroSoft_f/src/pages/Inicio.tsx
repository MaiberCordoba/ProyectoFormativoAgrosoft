import { useNavigate } from "react-router-dom";

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* Encabezado con navegación */}
      <header className="relative z-10 flex justify-between items-center px-10 py-6 text-white">
        <div className="text-2xl font-bold tracking-wide">
          AD<span className="text-green-400">SO</span> 2846103
        </div>
      </header>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-10 h-[calc(100vh-96px)]">
        {/* Lado izquierdo: texto sobre fondo oscuro */}
        <div className="bg-black/60 text-white p-10 rounded-lg max-w-xl backdrop-blur-md shadow-xl">
          <p className="text-green-400 text-sm uppercase tracking-widest mb-2">Sistema Tecnológico</p>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            AGRO<span className="text-green-400">SOFT</span>
          </h1>
          <p className="text-gray-200 mb-6">
            Es un sistema integral diseñado para el beneficio y desarrollo del campo a través de soluciones tecnológicas.
          </p>
          <button
            onClick={handleRedirect}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
          >
            Ir a módulo IoT
          </button>
        </div>
      </div>
    </div>
  );
}
