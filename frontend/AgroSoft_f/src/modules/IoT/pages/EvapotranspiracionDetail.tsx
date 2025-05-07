import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import EvapotranspiracionCard from "../components/EvapotranspiracionCard";

export default function EvapotranspiracionDetail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const cultivoId = params.get("cultivo_id");
  const loteId = params.get("lote_id") || "1";

  const [data, setData] = useState<null | {
    evapotranspiracion_mm_dia: number;
    kc: number;
    sensor_data: {
      temperatura: number;
      viento: number;
      iluminacion: number;
      humedad: number;
    };
  }>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cultivoId) return;

    fetch(
      `http://localhost:8000/api/evapotranspiracion/?cultivo_id=${cultivoId}&lote_id=${loteId}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener la ET");
        return res.json();
      })
      .then((et) => {
        setData(et);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al obtener datos de evapotranspiración.");
      });
  }, [cultivoId, loteId]);

  const chartData = data
    ? [
        { nombre: "Temperatura", valor: data.sensor_data.temperatura },
        { nombre: "Viento", valor: data.sensor_data.viento },
        { nombre: "Luz", valor: data.sensor_data.iluminacion },
        { nombre: "Humedad", valor: data.sensor_data.humedad },
      ]
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button color="primary" variant="flat" onClick={() => navigate(-1)}>
        Volver
      </Button>

      <h1 className="text-2xl font-bold text-center my-6">
        Detalles de Evapotranspiración
      </h1>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data ? (
        <>
          <EvapotranspiracionCard
            etReal={data.evapotranspiracion_mm_dia}
            kc={data.kc}
            detalles={data.sensor_data}
          />

          <div className="mt-10 bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-center mb-4">
              Gráfica de Datos de Sensores
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">Cargando datos...</p>
      )}
    </div>
  );
}
