import {
    WiStrongWind,
    WiThermometer,
    WiDaySunny,
    WiHumidity,
  } from "react-icons/wi";
  
  interface Props {
    etReal: number;
    kc: number;
    detalles: {
      temperatura: number;
      viento: number;
      iluminacion: number;
      humedad: number;
    };
  }
  
  export default function EvapotranspiracionCard({ etReal, kc, detalles }: Props) {
    return (
      <div className="bg-[#85929e] rounded-2xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-green-700 mb-4">Evapotranspiración</h2>
        <p><strong>ETc (mm/día):</strong> {etReal}</p>
        <p><strong>Kc:</strong> {kc}</p>
        <p className="mt-4 font-semibold text-gray-700">Datos utilizados:</p>
        <ul className="list-none text-sm text-gray-600 space-y-2 mt-2">
          <li className="flex items-center gap-2">
            <WiThermometer size={24} className="text-red-500" />
            Temperatura: {detalles.temperatura} °C
          </li>
          <li className="flex items-center gap-2">
            <WiStrongWind size={24} className="text-blue-500" />
            Viento: {detalles.viento} m/s
          </li>
          <li className="flex items-center gap-2">
            <WiDaySunny size={24} className="text-yellow-500" />
            Iluminación: {detalles.iluminacion} W/m²
          </li>
          <li className="flex items-center gap-2">
            <WiHumidity size={24} className="text-cyan-500" />
            Humedad: {detalles.humedad} %
          </li>
        </ul>
      </div>
    );
  }
  