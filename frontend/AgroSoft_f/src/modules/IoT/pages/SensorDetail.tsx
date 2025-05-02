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
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

interface SensorData {
  timestamp: string;
  valor: number;
}

export default function SensorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  // 🚀 Cargar datos guardados
  useEffect(() => {
    fetch(`http://localhost:3000/sensores/${id}`)
      .then(res => res.json())
      .then((data: any[]) => {
        const parsed = data.map(item => ({
          timestamp: new Date(item.fecha).toLocaleTimeString(),
          valor: parseFloat(item.valor),
        }));
        setSensorData(parsed.slice(-10)); 
      })
      .catch(error => {
        console.error("Error al cargar datos:", error);
      });
  }, [id]);

  // 🔁 WebSocket para recibir nuevo dato
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/sensor/${id}/`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const newData: SensorData = {
          timestamp: new Date(data.fecha).toLocaleTimeString(),
          valor: parseFloat(data.valor), 
        };

        setSensorData((prev) => {
          const updated = [...prev, newData];
          return updated.length > 10 ? updated.slice(-10) : updated;
        });
      } catch (error) {
        console.error("Error al recibir WebSocket:", error);
      }
    };

    return () => ws.close();
  }, [id]);

  return (
    <div className="p-6">
      <Button color="success" variant="light" onClick={() => navigate(-1)}>
        Regresar
      </Button>

      <h1 className="text-2xl font-bold text-center mb-4">
        Sensor ID: {id}
      </h1>

      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Gráfica (últimos 10)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Último dato</h2>
        <Table aria-label="Datos del sensor">
          <TableHeader>
            <TableColumn>Hora</TableColumn>
            <TableColumn>Valor</TableColumn>
          </TableHeader>
          <TableBody>
            {sensorData.slice(-1).map((item, index) => (
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
