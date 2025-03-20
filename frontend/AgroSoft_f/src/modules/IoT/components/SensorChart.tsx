import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SensorChartProps {
  sensorId: string;
  title: string;
}

export default function SensorChart({ sensorId, title }: SensorChartProps) {
  const [data, setData] = useState<{ time: string; value: number }[]>([]);
  const [lastValue, setLastValue] = useState<string>("Cargando...");

  useEffect(() => {
    const url = `ws://localhost:8000/ws/sensor/${sensorId}/`;
    const ws = new WebSocket(url);

    ws.onopen = () => console.log(`✅ Conectado a WebSocket de ${sensorId}`);

    ws.onmessage = (event) => {
      try {
        const sensorData = JSON.parse(event.data);
        const newValue = sensorData.valor || 0;
        const time = new Date().toLocaleTimeString();

        setLastValue(`${newValue}`);
        setData((prevData) => [...prevData.slice(-9), { time, value: newValue }]);
      } catch (error) {
        console.error(`❌ Error en ${sensorId}:`, error);
      }
    };

    ws.onclose = () => console.warn(`⚠️ WebSocket cerrado en ${sensorId}`);

    return () => {
      ws.close();
    };
  }, [sensorId]);

  return (
    <Card className="w-full max-w-[500px] shadow-lg p-4 rounded-lg bg-white">
      <CardHeader className="font-bold text-lg text-center">📊 {title}</CardHeader>
      <Divider />
      <CardBody className="text-center">
        <p className="text-lg font-semibold">Valor Actual: {lastValue}</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
      <Divider />
      <CardFooter className="text-gray-500 text-sm text-center">⚡ Datos en tiempo real</CardFooter>
    </Card>
  );
}
