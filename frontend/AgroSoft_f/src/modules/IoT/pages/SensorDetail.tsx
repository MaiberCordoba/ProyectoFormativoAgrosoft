import { useParams } from "react-router-dom";
import { useSensorData } from "../hooks/useSensorData";
import SensorChart from "../components/SensorChart.tsx";
import SensorTable from "../components/SensorTable";

const SensorDetail = () => {
  const { id } = useParams<{ id?: string }>(); // Manejo seguro de `id`
  const { data } = useSensorData();

  const sensorData = id ? data.filter(sensor => sensor.sensor_id === Number(id)) : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalles del Sensor {id ?? "Desconocido"}</h1>
      {sensorData.length > 0 ? (
        <>
          <SensorChart data={sensorData} />
          <SensorTable data={sensorData} />
        </>
      ) : (
        <p className="text-gray-500">No hay datos disponibles para este sensor.</p>
      )}
    </div>
  );
};

export default SensorDetail;