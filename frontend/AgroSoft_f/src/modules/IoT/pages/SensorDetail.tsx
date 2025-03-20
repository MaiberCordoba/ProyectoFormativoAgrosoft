import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function SensorDetail() {
  const { id } = useParams();
  const [data, setData] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    if (!id) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/sensor/${id}/`);

    ws.onopen = () => console.log(`✅ Conectado al WebSocket del sensor ${id}`);

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData((prevData) => [
          ...prevData.slice(-20), // Máximo 20 valores en la gráfica
          { time: new Date().toLocaleTimeString(), value: Number(newData.valor) || 0 },
        ]);
      } catch (error) {
        console.error(`❌ Error al recibir datos del sensor ${id}:`, error);
      }
    };

    ws.onclose = () => console.warn(`⚠️ WebSocket cerrado para el sensor ${id}`);

    return () => ws.close();
  }, [id]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold">Detalles del Sensor: {id}</h1>
      <p className="mb-4">Aquí se muestra la información en tiempo real del sensor {id}.</p>

      {/* 📊 Gráfica en tiempo real */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
