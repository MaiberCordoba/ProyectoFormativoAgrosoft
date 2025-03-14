import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { SensorData } from "../types/sensorTypes";

const SensorChart = ({ data }: { data: SensorData[] }) => {
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