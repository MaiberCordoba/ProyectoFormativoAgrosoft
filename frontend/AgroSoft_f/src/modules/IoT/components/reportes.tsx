import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Button,
  Select,
  SelectItem,
  DatePicker,
  Chip
} from '@heroui/react';
import {
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { FaFilePdf } from 'react-icons/fa';
import { SensorData, SENSOR_TYPES } from '../types/sensorTypes';

interface SensorReportProps {
  initialFilters?: {
    types: string[];
    lotes: number[];
    eras: number[];
  };
  sensorsData?: SensorData[];
  availableLotes?: { id: number; nombre: string }[];
  availableEras?: { id: number; nombre: string; fk_lote_id: number }[];
}

const SensorReport: React.FC<SensorReportProps> = ({
  initialFilters = { types: [], lotes: [], eras: [] },
  sensorsData = [],
  availableLotes = [],
  availableEras = []
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.types);
  const [selectedLotes, setSelectedLotes] = useState<number[]>(initialFilters.lotes);
  const [selectedEras, setSelectedEras] = useState<number[]>(initialFilters.eras);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const SENSOR_COLORS: Record<string, string> = {
    TEM: '#FF6384',
    HUM_A: '#36A2EB',
    HUM_T: '#4BC0C0',
    LUM: '#FFCE56',
    VIE: '#9966FF',
    PH: '#FF9F40'
  };

  const handleExportPDF = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .chart-container { height: 300px !important; }
      }
    `,
    documentTitle: `Reporte_Sensores_${new Date().toISOString().split('T')[0]}`
  });

  const filteredData = sensorsData.filter(sensor => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(sensor.tipo);
    const loteMatch = selectedLotes.length === 0 || (sensor.fk_lote_id && selectedLotes.includes(sensor.fk_lote_id));
    const eraMatch = selectedEras.length === 0 || (sensor.fk_eras_id && selectedEras.includes(sensor.fk_eras_id));
    const date = new Date(sensor.fecha);
    const dateMatch = (!dateRange.start || date >= dateRange.start) && (!dateRange.end || date <= dateRange.end);
    return typeMatch && (loteMatch || eraMatch) && dateMatch;
  });

  const prepareChartData = () => {
    const grouped: Record<string, any> = {};
    filteredData.forEach(sensor => {
      const date = new Date(sensor.fecha).toLocaleDateString();
      if (!grouped[date]) grouped[date] = { date };
      const key = `${sensor.tipo}_${sensor.fk_lote_id || sensor.fk_eras_id}`;
      grouped[date][key] = sensor.valor;
    });
    return Object.values(grouped);
  };

  const getSensorName = (sensor: SensorData) => {
    const typeName = SENSOR_TYPES.find(t => t.key === sensor.tipo)?.label || sensor.tipo;
    if (sensor.fk_lote_id) {
      const lote = availableLotes.find(l => l.id === sensor.fk_lote_id);
      return `${typeName} (Lote: ${lote?.nombre || sensor.fk_lote_id})`;
    } else if (sensor.fk_eras_id) {
      const era = availableEras.find(e => e.id === sensor.fk_eras_id);
      return `${typeName} (Era: ${era?.nombre || sensor.fk_eras_id})`;
    }
    return typeName;
  };

  const uniqueSensors = Array.from(
    new Set(filteredData.map(s => `${s.tipo}-${s.fk_lote_id || s.fk_eras_id}`))
  ).map(key => {
    const [type, locationId] = key.split('-');
    const sensor = filteredData.find(s => s.tipo === type && (s.fk_lote_id?.toString() === locationId || s.fk_eras_id?.toString() === locationId));
    return sensor ? {
      key,
      type,
      locationId: parseInt(locationId),
      color: SENSOR_COLORS[type],
      name: getSensorName(sensor)
    } : null;
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Filtros del Reporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipos de Sensor</label>
            <Select
              selectionMode="multiple"
              selectedKeys={selectedTypes}
              onSelectionChange={keys => setSelectedTypes(Array.from(keys) as string[])}
            >
              {SENSOR_TYPES.map(type => (
                <SelectItem key={type.key}>{type.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Lotes</label>
            <Select
              selectionMode="multiple"
              selectedKeys={selectedLotes.map(String)}
              onSelectionChange={keys => setSelectedLotes(Array.from(keys).map(Number))}
            >
              {availableLotes.map(lote => (
                <SelectItem key={String(lote.id)}>{lote.nombre}</SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Eras</label>
            <Select
              selectionMode="multiple"
              selectedKeys={selectedEras.map(String)}
              onSelectionChange={keys => setSelectedEras(Array.from(keys).map(Number))}
            >
              {availableEras.map(era => (
                <SelectItem key={String(era.id)}>{era.nombre} (Lote {era.fk_lote_id})</SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
            <DatePicker
              selected={dateRange.start}
              onChange={date => setDateRange({ ...dateRange, start: date })}
              selectsStart
              startDate={dateRange.start}
              endDate={dateRange.end}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fecha Fin</label>
            <DatePicker
              selected={dateRange.end}
              onChange={date => setDateRange({ ...dateRange, end: date })}
              selectsEnd
              startDate={dateRange.start}
              endDate={dateRange.end}
              minDate={dateRange.start}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div ref={reportRef} className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Reporte de Sensores</h1>
          <p className="text-gray-600">
            {dateRange.start?.toLocaleDateString()} - {dateRange.end?.toLocaleDateString()}
          </p>
        </div>

        <div className="mb-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {uniqueSensors.map(sensor => (
                <Line
                  key={sensor.key}
                  type="monotone"
                  dataKey={`${sensor.type}_${sensor.locationId}`}
                  stroke={sensor.color}
                  name={sensor.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleExportPDF} startIcon={<FaFilePdf />} color="red">
          Exportar PDF
        </Button>
      </div>
    </div>
  );
};

export default SensorReport;
