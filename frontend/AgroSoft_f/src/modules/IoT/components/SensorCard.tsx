import { Card, CardHeader, CardBody } from "@heroui/react";

interface SensorCardProps {
  icon: JSX.Element;
  title: string;
  value: string;
  onClick: () => void;
}

export default function SensorCard({ icon, title, value, onClick }: SensorCardProps) {
  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-3">
    <Card className="w-[180px] h-[120px] flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition rounded-lg bg-white p-3">
      <CardHeader className="text-sm font-semibold text-center">{title}</CardHeader>
      <CardBody className="flex flex-col items-center justify-center">
        <div
          className="cursor-pointer p-2 rounded-full hover:bg-gray-200 transition"
          onClick={(e) => {
            e.stopPropagation(); 
            onClick();
          }}
        >
          {icon}
        </div>
        <p className="text-lg font-bold">{value}</p>
      </CardBody>
    </Card>
    </div>
  );
}


