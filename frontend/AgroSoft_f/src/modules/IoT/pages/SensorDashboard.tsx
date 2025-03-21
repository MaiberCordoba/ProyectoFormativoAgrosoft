import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, addToast, Card } from "@heroui/react";
import { Search } from "lucide-react";

export default function SensorDashboard() {
  const [sensorId, setSensorId] = useState("");
  const navigate = useNavigate();

  const buscarSensor = async () => {
    if (!sensorId) {
      addToast({
        title: "⚠️ Advertencia",
        description: "Ingresa un ID de sensor",
        color: "warning",
        variant: "solid",
        radius: "full",
        timeout: 2000, 
      });
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/sensor/${sensorId}`);
      if (!res.ok) throw new Error("Sensor no encontrado");

      navigate(`/sensor/${sensorId}`);
    } catch {
      addToast({
        title: "❌ Error",
        description: "No existe el sensor que buscas",
        color: "danger",
        variant: "solid",
        radius: "full",
        timeout: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mb-6 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          <Input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Buscar Sensor por ID"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
          />
        </div>
        <Button
          color="primary"
          onClick={buscarSensor}
          className="px-6 py-2 font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Buscar
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {["Viento", "Temperatura", "Luz Solar", "Humedad", "H. Ambiente", "Lluvia"].map((sensor, index) => (
          <Card key={index} className="p-6 text-center shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-semibold">{sensor}</h3>
            <p className="text-gray-500">Cargando...</p>
          </Card>
        ))}
      </div>

      <Button color="primary" className="mt-6 px-6 py-2 text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300">
        Registrar Nuevo Sensor
      </Button>
    </div>
  );
}
