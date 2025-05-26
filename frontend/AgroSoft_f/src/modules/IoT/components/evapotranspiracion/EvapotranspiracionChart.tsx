import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  fecha: string;
  et_mm_dia: number;
  kc?: number;
  temperatura?: number;
  humedad?: number;
  fase_crecimiento?: string;
  dias_desde_siembra?: number;
}

type Props = {
  plantacionId: string;
  nuevoDato: any;
  showAdditionalInfo?: boolean;
};

const LOCAL_STORAGE_KEY = 'evapotranspiracion_data';

export default function EvapotranspiracionChart({ nuevoDato, showAdditionalInfo = false }: Props) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
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

  useEffect(() => {
    if (!nuevoDato) return;

    setData(prevData => {
      const fechaDia = new Date(nuevoDato.fecha).toISOString().split('T')[0];
      const exists = prevData.some(item => 
        new Date(item.fecha).toISOString().split('T')[0] === fechaDia
      );

      const newData = exists 
        ? prevData.map(item => 
            new Date(item.fecha).toISOString().split('T')[0] === fechaDia 
              ? nuevoDato 
              : item
          )
        : [...prevData, nuevoDato];

      const sortedData = newData.sort((a, b) => 
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      ).slice(-30);

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortedData));

      return sortedData;
    });
  }, [nuevoDato]);

  const sortedData = [...data].sort((a, b) => 
    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const renderTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
          <p className="text-green-600">ET: {data.et_mm_dia.toFixed(2)} mm/día</p>
          <p>Kc: {data.kc?.toFixed(2) || 'N/A'}</p>
          {showAdditionalInfo && (
            <>
              <p>Días desde siembra: {data.dias_desde_siembra || 'N/A'}</p>
            </>
          )}
          <p className="text-gray-500 text-sm">
            Temp: {data.temperatura?.toFixed(1) || 'N/A'}°C | 
            Hum: {data.humedad?.toFixed(1) || 'N/A'}%
          </p>
        </div>
      );
    }
    return null;
  };

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
            <Tooltip content={renderTooltip} />
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