import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface SensorData {
  timestamp: string;
  valor: number;
}

export default function SensorDetail() {
  const { id } = useParams();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/sensor/${id}/`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData((prev) => [...prev.slice(-9), { timestamp: new Date().toLocaleTimeString(), valor: data.valor }]);
      } catch (error) {
        console.error(`Error en WebSocket (${id}):`, error);
      }
    };

    return () => ws.close();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Detalles del Sensor: {id}</h1>

      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Gráfica en tiempo real</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-2"> Datos recientes</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Tiempo</th>
              <th className="border border-gray-300 p-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{item.timestamp}</td>
                <td className="border border-gray-300 p-2">{item.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
