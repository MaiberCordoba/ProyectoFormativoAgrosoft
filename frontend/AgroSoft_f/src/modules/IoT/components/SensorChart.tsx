import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import useSensorData from "../hooks/useSensorData";

export default function SensorCard() {
  const { temperatura, alerta } = useSensorData(1);

  return (
    <Card className="max-w-[400px] shadow-lg">
      <CardHeader className="font-bold text-lg">🌡️ Sensor de Temperatura</CardHeader>
      <Divider />
      <CardBody>
        <p className="text-lg font-semibold">Temperatura: {temperatura}°C</p>
        {alerta && <p className="text-red-500 font-medium">{alerta}</p>}
      </CardBody>
      <Divider />
      <CardFooter className="text-gray-500 text-sm">⚡ Datos en tiempo real</CardFooter>
    </Card>
  );
}
