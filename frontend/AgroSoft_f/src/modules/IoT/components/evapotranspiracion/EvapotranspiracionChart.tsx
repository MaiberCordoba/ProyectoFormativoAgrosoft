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
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 60%, #e0f2fe 100%)',
            borderRadius: '0.75rem',
            boxShadow: '0 6px 24px 0 rgba(16, 185, 129, 0.10)',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontWeight: 500,
            fontSize: 14,
            padding: 12,
          }}
        >
          <p style={{ fontWeight: 600 }}>{new Date(label).toLocaleDateString()}</p>
          <p>ET: {data.et_mm_dia.toFixed(2)} mm/día</p>
          <p>Kc: {data.kc?.toFixed(2) || 'N/A'}</p>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            Temp: {data.temperatura?.toFixed(1) || 'N/A'}°C | 
            Hum: {data.humedad?.toFixed(1) || 'N/A'}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/80 rounded-xl shadow-md p-4 w-full max-w-3xl mt-6">
      <h3 className="text-lg font-semibold text-center text-green-800 mb-4">
        Histórico de Evapotranspiración (mm/día)
      </h3>
      {sortedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
            data={sortedData}
            margin={{ top: 30, right: 40, left: 10, bottom: 30 }}
            >
            <defs>
              <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#f0fdf4" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="url(#colorGrid)"
              strokeDasharray="4 4"
              vertical={true}
              horizontal={true}
            />
            <XAxis
              dataKey="fecha"
              tick={{ fill: '#4b5563', fontWeight: 500, fontSize: 13 }}
              tickMargin={12}
              interval="preserveStartEnd"
              axisLine={{ stroke: "#a7f3d0" }}
              tickLine={{ stroke: "#a7f3d0" }}
              tickFormatter={(fecha) => new Date(fecha).toLocaleDateString()}
            />
            <YAxis
              tick={{ fill: '#4b5563', fontWeight: 500, fontSize: 13 }}
              tickMargin={12}
              axisLine={{ stroke: "#a7f3d0" }}
              tickLine={{ stroke: "#a7f3d0" }}
            />
            <Tooltip content={renderTooltip} />
            <Line
              type="monotone"
              dataKey="et_mm_dia"
              stroke="#2ECC71"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Evapotranspiración"
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