import { useSensorData } from "../hooks/useSensorData";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const SensorChart = () => {
  const { data } = useSensorData();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Gráfica de Sensores</h2>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="valor" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default SensorChart;


