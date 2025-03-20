import { Card, CardHeader, CardBody } from "@heroui/react";

interface SensorCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  detail?: string;
  onClick?: () => void;
}

export default function SensorCard({ icon, title, value, detail, onClick }: SensorCardProps) {
  return (
    <Card 
      className="w-[180px] h-[120px] flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition rounded-lg bg-white p-3"
      onClick={onClick}
    >
      <CardHeader className="text-sm font-semibold text-center">{title}</CardHeader>
      <CardBody className="flex flex-col items-center justify-center">
        {icon}
        <p className="text-lg font-bold">{value}</p>
        {detail && <p className="text-xs text-gray-500">{detail}</p>}
      </CardBody>
    </Card>
  );
}
