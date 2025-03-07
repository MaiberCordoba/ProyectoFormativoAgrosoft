import React, { useEffect, useState } from "react";
import SensorChart from "../components/SensorChart"; // Asegúrate de que la ruta sea correcta
import SensorTable from "../components/SensorTable"; // Asegúrate de que la ruta sea correcta
import { useSensorData } from "../hooks/useSensorData"; // Asegúrate de que la ruta sea correcta
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'; // Asegúrate de que la ruta sea correcta

const IoTPage = () => {
  const { data, alert } = useSensorData(); // Obtén la alerta del hook
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (alert) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000); // La alerta desaparece después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Módulo IoT</h1>
      {showAlert && alert && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <ExclamationCircleIcon className="inline-block mr-2 h-5 w-5" />
          {alert}
        </div>
      )}
      <SensorChart />
      <SensorTable />
    </div>
  );
};

export default IoTPage;