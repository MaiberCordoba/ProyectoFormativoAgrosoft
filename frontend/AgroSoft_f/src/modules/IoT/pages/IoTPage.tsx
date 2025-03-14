import { Link } from "react-router-dom";
import { Wind, Thermometer, Sun, Droplets, CloudRain, Waves } from "lucide-react";
import { useSensorContext } from "../context/SensorContext";

const IoTPage = () => {
  const { data, alert } = useSensorContext();

  const sensorValues = (data || []).reduce((acc, sensor) => {
    acc[sensor.sensor_id] = sensor.valor;
    return acc;
  }, {} as Record<number, string>);

  const sensors = [
    { id: 1, name: "Viento", value: `${sensorValues[1] || "Cargando..."} km/h`, icon: <Wind size={50} /> },
    { id: 2, name: "Temperatura", value: `${sensorValues[2] || "Cargando..."}°C`, icon: <Thermometer size={50} />, link: "/iot/sensor/1" },
    { id: 3, name: "Luz solar", value: `${sensorValues[3] || "Parcialmente nublado (46%)"}`, icon: <Sun size={50} /> },
    { id: 4, name: "Humedad", value: `${sensorValues[4] || "10%"}`, icon: <Droplets size={50} className="text-blue-500" /> },
    { id: 5, name: "H. Ambiente", value: `${sensorValues[5] || "30%"}`, icon: <Waves size={50} /> },
    { id: 6, name: "Lluvia", value: sensorValues[6] === "1" ? "Sí" : "No", icon: <CloudRain size={50} /> },
  ];

  return (
    <div className="p-12 flex ">
      <h1 className="text-2xl font-bold mb-12 text-center">Módulo IoT</h1>

      {alert && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
          ⚠️ {alert}
        </div>
      )}

      <div className="grid grid-cols-3 grid-row-3 gap-4 ">
        {sensors.map(({ id, name, value, icon, link }) => (
          <div
            key={id}
            className="bg-white rounded-xl shadow-lg shadow-gray-300 p-6 flex flex-col flex-1  items-center transition-all duration-200 hover:shadow-xl"
          >
            {link ? <Link to={link}>{icon}</Link> : icon}
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="text-black font-medium text-lg">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IoTPage;
