import { Card, CardBody, CardFooter } from "@heroui/react";

interface SensorCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  additionalInfo?: string | null;
  average?: number; 
  onClick: () => void;
}

export default function SensorCard({ 
  icon, 
  title, 
  value, 
  additionalInfo,
  average,
  onClick 
}: SensorCardProps) {
  return (
    <Card
      isPressable
      shadow="sm"
      onPress={onClick}
      className="w-full min-w-[260px] max-w-[280px] h-[220px] flex flex-col items-center justify-between rounded-2xl shadow-lg hover:shadow-xl transition bg-white p-4 m-4"
    >
      <CardBody className="flex flex-col items-center justify-center">
        <div className="text-gray-700 text-5xl">{icon}</div>
        <p className="text-xl font-bold mt-3 text-center">{value}</p>
        {average !== undefined && (
          <p className="text-sm text-blue-500 mt-1">
            Promedio: <span className="font-semibold">{average}</span>
          </p>
        )}
      </CardBody>

      <CardFooter className="bg-gray-100 text-center items-center py-2 w-full rounded-b-2xl">
        <div className="w-full">
          <p className="font-semibold text-center">{title}</p>
          {additionalInfo && (
            <p className="text-xs text-gray-500 mt-1">
              {additionalInfo}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
