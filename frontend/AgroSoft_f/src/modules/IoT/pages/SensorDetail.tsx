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
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos históricos del sensor
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/api/sensor/${id}/history/?hours=24`)
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const parsed = data.map(item => ({
            timestamp: new Date(item.fecha).toLocaleTimeString(),
            valor: parseFloat(item.valor),
          }));
          setSensorData(parsed.slice(-10));
        } else {
          console.error("Estructura inesperada del backend:", data);
        }
      })
      .catch(error => {
        console.error("Error al cargar datos históricos:", error);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // WebSocket para datos en tiempo real
  useEffect(() => {
    let socket: WebSocket;

    try {
      socket = new WebSocket(`ws://localhost:8000/ws/sensor/${id}/`);

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newPoint: SensorData = {
          timestamp: new Date(data.fecha).toLocaleTimeString(),
          valor: parseFloat(data.datos_sensor),
        };

        setSensorData(prev => [...prev.slice(-9), newPoint]);
      };

      socket.onerror = (error) => {
        console.error("Error de WebSocket:", error);
      };
    } catch (err) {
      console.error("Fallo al establecer WebSocket:", err);
    }

    return () => {
      if (socket) socket.close();
    };
  }, [id]);

  return (
    <div className="p-6">
      <Button 
        color="success" 
        variant="light" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        Regresar
      </Button>

      <h1 className="text-2xl font-bold text-center mb-6">
        Detalles del Sensor #{id}
      </h1>

      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Gráfica en Tiempo Real</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando datos...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fill: '#6b7280' }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Historial Reciente</h2>
        <Table aria-label="Datos del sensor" className="w-full">
          <TableHeader>
            <TableColumn className="bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hora
            </TableColumn>
            <TableColumn className="bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </TableColumn>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4">
                  Cargando datos...
                </TableCell>
              </TableRow>
            ) : sensorData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            ) : (
              [...sensorData].reverse().map((item, index) => (
                <TableRow 
                  key={index} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {item.timestamp}
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.valor.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}