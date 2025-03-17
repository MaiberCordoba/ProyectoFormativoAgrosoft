import { useParams } from "react-router-dom";
import useSensorData from "../hooks/useSensorData";
import SensorChart from "../components/SensorChart";

const SensorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useSensorData();

  const filteredData = data.filter((sensor) => sensor.sensor_id === Number(id));

  return (
    <div>
      <h1> Sensor {id} </h1>
      <SensorChart data={filteredData} />
    </div>
  );
};

export default SensorDetail;
