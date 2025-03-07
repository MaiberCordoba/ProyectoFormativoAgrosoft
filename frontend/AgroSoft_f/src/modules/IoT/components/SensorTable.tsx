import { useSensorData } from "../hooks/useSensorData";

const SensorTable = () => {
  const { data } = useSensorData();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Datos de Sensores</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Valor</th>
            <th className="p-2 border">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sensor) => (
            <tr key={sensor.timestamp} className="border-t">
              <td className="p-2 border">{sensor.sensor_id}</td>
              <td className="p-2 border">{sensor.valor}</td>
              <td className="p-2 border">{sensor.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SensorTable;
