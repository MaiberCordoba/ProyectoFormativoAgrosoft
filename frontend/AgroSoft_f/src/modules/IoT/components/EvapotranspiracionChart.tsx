import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  fecha: string;
  et_mm_dia: number;
  kc?: number;
  temperatura?: number;
  humedad?: number;
}

interface Props {
  nuevoDato: DataPoint | null;
}

const LOCAL_STORAGE_KEY = 'evapotranspiracion_data';

export default function EvapotranspiracionChart({ nuevoDato }: Props) {
  const [data, setData] = useState<DataPoint[]>([]);

  // Cargar y guardar datos en localStorage
  useEffect(() => {
    // Cargar datos existentes al montar el componente
    const loadData = () => {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (Array.isArray(parsedData)) {
            setData(parsedData);
          }
        } catch (error) {
          console.error("Error al cargar datos del localStorage:", error);
        }
      }
    };

    loadData();
  }, []);

  // Actualizar datos cuando llega nueva información
  useEffect(() => {
    if (!nuevoDato) return;

    setData(prevData => {
      // Verificar si ya existe un dato con la misma fecha (mismo día)
      const fechaDia = new Date(nuevoDato.fecha).toISOString().split('T')[0];
      const exists = prevData.some(item => 
        new Date(item.fecha).toISOString().split('T')[0] === fechaDia
      );

      // Si no existe, agregarlo al historial
      const newData = exists 
        ? prevData.map(item => 
            new Date(item.fecha).toISOString().split('T')[0] === fechaDia 
              ? nuevoDato 
              : item
          )
        : [...prevData, nuevoDato];

      // Ordenar por fecha y limitar a 30 días
      const sortedData = newData.sort((a, b) => 
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      ).slice(-30);

      // Guardar en localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortedData));

      return sortedData;
    });
  }, [nuevoDato]);

  // Datos ordenados para la gráfica
  const sortedData = [...data].sort((a, b) => 
    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-3xl mt-6">
      <h3 className="text-lg font-semibold text-center text-green-800 mb-4">
        Histórico de Evapotranspiración (mm/día)
      </h3>
      {sortedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sortedData}>
            <Line 
              type="monotone" 
              dataKey="et_mm_dia" 
              stroke="#2ECC71" 
              strokeWidth={3} 
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Evapotranspiración"
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis 
              dataKey="fecha" 
              tickFormatter={(fecha) => new Date(fecha).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} mm/día`, 'Evapotranspiración']}
              labelFormatter={(fecha) => `Fecha: ${new Date(fecha).toLocaleDateString()}`}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No hay datos históricos disponibles. Realiza un cálculo para comenzar.
        </div>
      )}
    </div>
  );
}