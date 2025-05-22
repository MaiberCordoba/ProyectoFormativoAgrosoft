import { Cosechas } from "./types";

type Props = {
  cosechas: Cosechas[];
};

export function CosechasResumenCard({ cosechas }: Props) {
  const total = cosechas.reduce((acc, c) => acc + c.cantidad, 0);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {cosechas.map((cosecha) => (
        <div
          key={cosecha.id}
          className="w-30 h-30 bg-white shadow-md rounded-md border p-2 text-sm flex flex-col justify-center"
        >
          <p className="text-gray-500">Fecha Cosecha: {cosecha.fecha}</p>
          <p className="font-bold">Cantidad: {cosecha.cantidad}</p>
        </div>
      ))}

      <div className="w-30 h-30 bg-white border border-green-400 rounded-md p-2 text-center flex flex-col justify-center">
        <p className="text-sm font-semibold text-green-800">Cantidad Cosechas</p>
        <p className="text-xl font-bold text-green-900">{total}</p>
      </div>
    </div>
  );
}
