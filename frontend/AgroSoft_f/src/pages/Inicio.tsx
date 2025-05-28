import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card"; 

export function Inicio() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/sensores");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: 'url("/public/ImagenHome.JPG")' }}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRedirect}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Ir a módulo IoT
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="p-6 text-center text-gray-800 bg-white/80 backdrop-blur-md shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Bienvenido</h2>
          <p className="text-md text-gray-600">
            Este espacio está disponible para contenido futuro o mensajes importantes.
          </p>
        </Card>
      </div>
    </div>
  );
}
