import { Card, CardBody, CardFooter } from "@heroui/react";

interface SensorCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  onClick: () => void;
}

export default function SensorCard({ icon, title, value, onClick }: SensorCardProps) {
  return (
    <Card
  isPressable
  shadow="sm"
  onPress={onClick}
  className="w-full min-w-[260px] max-w-[2800px] h-[200px] flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-xl transition bg-white p-6 my-6"
>

  
      <CardBody className="flex flex-col items-center justify-center">
        <div className="text-gray-700 text-5xl">{icon}</div>
        <p className="text-xl font-bold mt-3 text-center">{value}</p>
      </CardBody>
      <CardFooter className="bg-gray-100 text-center items-center py-2 w-full rounded-b-2xl">
        <p className="font-semibold text-lg">{title}</p>
      </CardFooter>
    </Card>
  );
}