import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button
} from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface SensorData {
  timestamp: string;
  valor: number;
}

export default function SensorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/sensor/${id}/`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newData: SensorData = { timestamp: new Date().toLocaleTimeString(), valor: data.valor };

        setSensorData((prev) => {
          const updatedData = [...prev, newData];
          return updatedData.length > 10 ? updatedData.slice(-10) : updatedData;
        });
      } catch (error) {
        console.error(`Error en WebSocket (${id}):`, error);
      }
    };

    return () => ws.close();
  }, [id]);

  return (
    <div className="p-6">
      <Button color="success" variant="light" onClick={() => navigate(-1)}>
        Regresar
      </Button>

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
        <h2 className="text-lg font-semibold mb-2">Datos recientes</h2>
        <Table aria-label="Datos del sensor" selectionMode="single">
          <TableHeader>
            <TableColumn>Tiempo</TableColumn>
            <TableColumn>Valor</TableColumn>
          </TableHeader>
          <TableBody>
            {sensorData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.timestamp}</TableCell>
                <TableCell>{item.valor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
