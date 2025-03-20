import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

export default function SensorDetail() {
  const { sensorId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<{ time: string; value: number }[]>([]);
  const [latestValue, setLatestValue] = useState("Cargando...");

  useEffect(() => {
    if (!sensorId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/sensor/${sensorId}/`);

    ws.onopen = () => console.log(`✅ Conectado al WebSocket de ${sensorId}`);
    
    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setLatestValue(newData.valor || "-");

        setData((prevData) => [
          ...prevData.slice(-9), // Mantener solo los últimos 10 datos
          { time: new Date().toLocaleTimeString(), value: newData.valor || 0 },
        ]);
      } catch (error) {
        console.error(`❌ Error en ${sensorId}:`, error);
      }
    };

    ws.onclose = () => console.warn(`⚠️ WebSocket cerrado en ${sensorId}`);

    return () => ws.close();
  }, [sensorId]);

  const chartOptions = {
    chart: { id: "sensor-data", toolbar: { show: false } },
    xaxis: { categories: data.map((d) => d.time) },
    colors: ["#ff6600"],
  };

  const chartSeries = [{ name: sensorId, data: data.map((d) => d.value) }];

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 p-2 bg-gray-200 rounded">
        ⬅ Volver
      </button>

      <h2 className="text-xl font-bold mb-4">
        Sensor: {sensorId?.toUpperCase()}
      </h2>
      
      <div className="text-lg mb-4">Último valor: <strong>{latestValue}</strong></div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
      </div>
    </div>
  );
}
