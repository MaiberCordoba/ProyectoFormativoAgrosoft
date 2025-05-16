import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, SelectItem, Chip } from "@heroui/react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

// types.ts
export interface SensorData {
  id?: number;
  fk_lote?: number | null;
  fk_eras?: number | null;
  fecha: string;
  tipo: "TEM" | "LUM" | "HUM_A" | "VIE" | "HUM_T" | "PH" | "LLUVIA";
  valor: number;
  umbral_minimo?: number | null;
  umbral_maximo?: number | null;
}

export const SENSOR_TYPES = [
  { key: "TEM", label: "Temperatura" },
  { key: "LUM", label: "Iluminación" },
  { key: "HUM_A", label: "Humedad Ambiental" },
  { key: "VIE", label: "Velocidad del Viento" },
  { key: "HUM_T", label: "Humedad del Terreno" },
  { key: "PH", label: "Nivel de PH" },
  { key: "LLUVIA", label: "Lluvia" }
];

export interface SensorConExtras extends SensorData {
  unidad: string;
  alerta: boolean;
}

const SENSOR_COLORS: Record<string, string> = {
  TEM: "#8884d8",
  LUM: "#ffc658",
  HUM_A: "#82ca9d",
  VIE: "#ff8042",
  HUM_T: "#0088FE",
  PH: "#00C49F",
  LLUVIA: "#FFBB28"
};

const SENSOR_UNITS: Record<string, string> = {
  TEM: "°C",
  LUM: "lux",
  HUM_A: "%",
  VIE: "km/h",
  HUM_T: "%",
  PH: "pH",
  LLUVIA: "mm"
};

const LOTES_ONLY = ["TEM", "LUM", "HUM_A", "VIE", "LLUVIA"];
const ERAS_ONLY = ["HUM_T", "PH"];

function dict(sensorTypes: {key: string, label: string}[]): Map<string, string> {
  const map = new Map();
  sensorTypes.forEach(type => map.set(type.key, type.label));
  return map;
}

const formatDateTimeForDisplay = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatNumber = (value: unknown): string => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  if (typeof value === 'string' && !isNaN(Number(value))) {
    return Number(value).toFixed(2);
  }
  return 'N/A';
};

export default function AllSensorsDashboard() {
  const navigate = useNavigate();
  const [allSensorsData, setAllSensorsData] = useState<SensorConExtras[]>([]);
  const [realTimeData, setRealTimeData] = useState<SensorConExtras[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [selectedLotes, setSelectedLotes] = useState<number[]>([]);
  const [selectedEras, setSelectedEras] = useState<number[]>([]);
  const [availableLotes, setAvailableLotes] = useState<{id: number, nombre: string}[]>([]);
  const [availableEras, setAvailableEras] = useState<{id: number, nombre: string, fk_lote_id: number}[]>([]);
  const [showLotesSelect, setShowLotesSelect] = useState(true);
  const [showErasSelect, setShowErasSelect] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    if (selectedType === "") {
      setShowLotesSelect(true);
      setShowErasSelect(true);
      return;
    }

    const hasLoteSensors = LOTES_ONLY.includes(selectedType);
    const hasEraSensors = ERAS_ONLY.includes(selectedType);

    setShowLotesSelect(hasLoteSensors);
    setShowErasSelect(hasEraSensors);

    if (!hasLoteSensors) setSelectedLotes([]);
    if (!hasEraSensors) setSelectedEras([]);
  }, [selectedType]);

  const checkForAlerts = (sensor: SensorData): boolean => {
    if (sensor.umbral_minimo !== null && sensor.umbral_maximo !== null) {
      return sensor.valor < sensor.umbral_minimo || sensor.valor > sensor.umbral_maximo;
    }
    return false;
  };

  const getLocationName = (sensor: SensorConExtras): string => {
    if (sensor.fk_lote) {
      const lote = availableLotes.find(l => l.id === sensor.fk_lote);
      return lote ? `Lote ${lote.nombre}` : `Lote ID:${sensor.fk_lote}`;
    }
    if (sensor.fk_eras) {
      const era = availableEras.find(e => e.id === sensor.fk_eras);
      if (era) {
        const lote = availableLotes.find(l => l.id === era.fk_lote_id);
        return `Era ${era.id}${lote ? ` (Lote ${lote.nombre})` : ''}`;
      }
      return `Era ID:${sensor.fk_eras}`;
    }
    return "Sin ubicación";
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const sensorsResponse = await fetch("http://127.0.0.1:8000/api/sensor/?limit=100");
        if (!sensorsResponse.ok) throw new Error("Error al obtener sensores");
        const sensorsData: SensorData[] = await sensorsResponse.json();

        if (Array.isArray(sensorsData)) {
          const enrichedData = sensorsData.map(item => ({
            ...item,
            unidad: SENSOR_UNITS[item.tipo],
            alerta: checkForAlerts(item)
          }));
          setAllSensorsData(enrichedData);

          const [lotesResponse, erasResponse] = await Promise.all([
            fetch("http://127.0.0.1:8000/api/lote/"),
            fetch("http://127.0.0.1:8000/api/eras/")
          ]);

          if (!lotesResponse.ok || !erasResponse.ok) {
            throw new Error("Error al obtener datos de ubicación");
          }

          const lotesData = await lotesResponse.json();
          const erasData = await erasResponse.json();

          setAvailableLotes(lotesData);
          setAvailableEras(erasData.map((era: any) => ({
            id: era.id,
            nombre: era.nombre,
            fk_lote_id: era.fk_lote_id
          })));
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/sensor/all/");

    socket.onmessage = (event) => {
      try {
        const data: SensorData = JSON.parse(event.data);
        const enrichedData: SensorConExtras = {
          ...data,
          unidad: SENSOR_UNITS[data.tipo],
          alerta: checkForAlerts(data)
        };
        setRealTimeData(prev => [...prev, enrichedData]);
      } catch (error) {
        console.error("Error al procesar datos del WebSocket:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Error de WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const combinedData = useMemo(() => {
    return [...allSensorsData, ...realTimeData];
  }, [allSensorsData, realTimeData]);

  const filteredSensors = useMemo(() => {
    return combinedData.filter(sensor => {
      const typeMatch = !selectedType || sensor.tipo === selectedType;
      const sensorMatch = selectedSensors.length === 0 || 
        (sensor.id && selectedSensors.includes(sensor.id.toString()));
      const loteMatch = selectedLotes.length === 0 || 
        (sensor.fk_lote && selectedLotes.includes(sensor.fk_lote));
      const eraMatch = selectedEras.length === 0 || 
        (sensor.fk_eras && selectedEras.includes(sensor.fk_eras));

      return typeMatch && sensorMatch && (loteMatch || eraMatch);
    });
  }, [combinedData, selectedType, selectedSensors, selectedLotes, selectedEras]);

  const chartData = useMemo(() => {
    const groupedByTime: Record<string, Record<string, number>> = {};

    combinedData.forEach(sensor => {
      const timeKey = new Date(sensor.fecha).toLocaleTimeString();
      if (!groupedByTime[timeKey]) {
        groupedByTime[timeKey] = { timestamp: timeKey };
      }
      if (sensor.id) {
        groupedByTime[timeKey][`${sensor.id}_valor`] = sensor.valor;
      }
    });

    return Object.values(groupedByTime);
  }, [combinedData]);

  const linesToShow = useMemo(() => {
    return filteredSensors.map(sensor => ({
      id: sensor.id?.toString() ?? '',
      type: sensor.tipo,
      location: getLocationName(sensor),
      color: SENSOR_COLORS[sensor.tipo],
      unit: SENSOR_UNITS[sensor.tipo]
    }));
  }, [filteredSensors]);

  const generatePDFReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const margin = 15;
      let yPosition = margin;

      // Función para agregar nueva página si es necesario
      const checkPageBreak = (neededSpace: number) => {
        if (yPosition + neededSpace > 280) {
          doc.addPage();
          yPosition = margin;
          addHeader(false);
        }
      };

      // Encabezado
      const addHeader = (isFirstPage = true) => {
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de Sensores Agrícolas", 105, yPosition, { align: "center" });
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Generado el: ${formatDateTimeForDisplay(new Date())}`, 105, yPosition, { align: "center" });
        yPosition += 15;

        if (!isFirstPage) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text(`Página ${doc.getNumberOfPages()}`, 195, 15);
        }
      };

      addHeader();

      // Sección de Filtros
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Filtros aplicados", margin, yPosition);
      yPosition += 8;

      let filtersText = "• Todos los sensores";
      if (selectedType) {
        filtersText += `\n• Tipo: ${dict(SENSOR_TYPES).get(selectedType)}`;
      }
      if (selectedLotes.length > 0) {
        filtersText += `\n• Lotes: ${selectedLotes.map(id => {
          const lote = availableLotes.find(l => l.id === id);
          return lote ? lote.nombre : `ID ${id}`;
        }).join(", ")}`;
      }
      if (selectedEras.length > 0) {
        filtersText += `\n• Eras: ${selectedEras.map(id => {
          const era = availableEras.find(e => e.id === id);
          return era ? era.nombre : `ID ${id}`;
        }).join(", ")}`;
      }

      const splitText = doc.splitTextToSize(filtersText, 180);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(splitText, margin, yPosition);
      yPosition += splitText.length * 5 + 15;

      // Datos de sensores
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Datos de Sensores", margin, yPosition);
      yPosition += 10;

      if (filteredSensors.length === 0) {
        doc.setFontSize(12);
        doc.text("No hay datos de sensores para los filtros seleccionados", margin, yPosition);
        yPosition += 10;
      } else {
        const tableData = filteredSensors.map(sensor => [
          sensor.id?.toString() || 'N/A',
          dict(SENSOR_TYPES).get(sensor.tipo) || sensor.tipo,
          `${formatNumber(sensor.valor)} ${sensor.unidad}`,
          sensor.umbral_minimo !== null ? `${formatNumber(sensor.umbral_minimo)} ${sensor.unidad}` : 'N/A',
          sensor.umbral_maximo !== null ? `${formatNumber(sensor.umbral_maximo)} ${sensor.unidad}` : 'N/A',
          formatDateTimeForDisplay(sensor.fecha),
          getLocationName(sensor),
          sensor.alerta ? 'Sí' : 'No'
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['ID', 'Tipo', 'Valor', 'Umbral Mín', 'Umbral Máx', 'Fecha', 'Ubicación', 'Alerta']],
          body: tableData,
          margin: { left: margin, right: margin },
          styles: { 
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: { 
            fillColor: [46, 204, 113],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          },
          didDrawPage: (data) => {
            yPosition = data.cursor.y + 10;
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Gráficas
      if (filteredSensors.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Gráficas de Datos", margin, yPosition);
        yPosition += 10;

        // Capturar la gráfica del dashboard
        const chartElement = document.querySelector('.recharts-wrapper');
        if (chartElement) {
          try {
            const canvas = await html2canvas(chartElement as HTMLElement);
            const imgData = canvas.toDataURL('image/png');
            
            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            checkPageBreak(imgHeight + 10);
            doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
          } catch (error) {
            console.error("Error al generar gráfica:", error);
            doc.setFontSize(10);
            doc.text("No se pudo incluir la gráfica en el reporte", margin, yPosition);
            yPosition += 10;
          }
        }
      }

      // Alertas
      const alertas = filteredSensors.filter(sensor => sensor.alerta);
      if (alertas.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Alertas (${alertas.length})`, margin, yPosition);
        yPosition += 10;

        const alertTableData = alertas.map(alert => [
          alert.id?.toString() || 'N/A',
          dict(SENSOR_TYPES).get(alert.tipo) || alert.tipo,
          `${formatNumber(alert.valor)} ${alert.unidad}`,
          `${alert.umbral_minimo !== null ? formatNumber(alert.umbral_minimo) : 'N/A'} - ${alert.umbral_maximo !== null ? formatNumber(alert.umbral_maximo) : 'N/A'} ${alert.unidad}`,
          formatDateTimeForDisplay(alert.fecha),
          getLocationName(alert)
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['ID', 'Tipo', 'Valor', 'Rango Normal', 'Fecha', 'Ubicación']],
          body: alertTableData,
          margin: { left: margin, right: margin },
          styles: { 
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: { 
            fillColor: [231, 76, 60],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          didDrawPage: (data) => {
            yPosition = data.cursor.y + 10;
          }
        });
      }

      // Pie de página
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150);
        doc.text(
          `Página ${i} de ${totalPages}`,
          105,
          287,
          { align: "center" }
        );
        doc.text(
          "© Sistema de Monitoreo Agrícola",
          195,
          287,
          { align: "right" }
        );
      }

      // Guardar el PDF
      const fileName = `Reporte_Sensores_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Ocurrió un error al generar el reporte");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          color="success" 
          variant="light" 
          onClick={() => navigate(-1)}
        >
          Regresar
        </Button>
        
        <Button 
          color="primary" 
          onClick={generatePDFReport}
          isDisabled={isLoading || isGeneratingReport}
          isLoading={isGeneratingReport}
        >
          Generar Reporte PDF
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">
        Todos los Sensores
      </h1>

      <div className="bg-white p-6 shadow-md rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Sensor
          </label>
          <Select
            selectedKeys={selectedType ? [selectedType] : []}
            onSelectionChange={(keys) => {
              const newType = Array.from(keys)[0] as string;
              setSelectedType(newType);
              setSelectedSensors([]);
            }}
          >
            {SENSOR_TYPES.map(type => (
              <SelectItem key={type.key} value={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {selectedType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sensores {dict(SENSOR_TYPES).get(selectedType)}
            </label>
            <Select
              selectionMode="multiple"
              selectedKeys={selectedSensors}
              onSelectionChange={(keys) => setSelectedSensors(Array.from(keys) as string[])}
            >
              {combinedData
                .filter(sensor => sensor.tipo === selectedType)
                .map(sensor => (
                  <SelectItem 
                    key={sensor.id?.toString() ?? ''} 
                    value={sensor.id?.toString() ?? ''}
                  >
                    {`${dict(SENSOR_TYPES).get(sensor.tipo)} - ${getLocationName(sensor)}`}
                  </SelectItem>
                ))}
            </Select>
          </div>
        )}

        {showLotesSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lotes
            </label>
            <Select
              selectionMode="multiple"
              selectedKeys={selectedLotes.map(String)}
              onSelectionChange={(keys) => setSelectedLotes(Array.from(keys).map(Number))}
            >
              {availableLotes.map(lote => (
                <SelectItem key={String(lote.id)}>
                  {lote.nombre}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Datos de Sensores</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {linesToShow.map((line, index) => (
                <Chip 
                  key={index}
                  color="primary"
                  variant="dot"
                  style={{ backgroundColor: line.color }}
                >
                  {dict(SENSOR_TYPES).get(line.type)} - {line.location}
                </Chip>
              ))}
            </div>
            
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fill: '#6b7280' }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                  formatter={(value: number, name: string) => {
                    const sensorId = name.split('_')[0];
                    const sensor = linesToShow.find(s => s.id === sensorId);
                    return [`${value} ${sensor?.unit}`, `${dict(SENSOR_TYPES).get(sensor?.type ?? '')} - ${sensor?.location}`];
                  }}
                  labelFormatter={(label) => `Hora: ${label}`}
                />
                <Legend 
                  formatter={(value) => {
                    const sensorId = value.split('_')[0];
                    const sensor = linesToShow.find(s => s.id === sensorId);
                    return `${dict(SENSOR_TYPES).get(sensor?.type ?? '')} - ${sensor?.location}`;
                  }}
                />
                
                {linesToShow.map((sensor) => (
                  <Line
                    key={sensor.id}
                    type="monotone"
                    dataKey={`${sensor.id}_valor`}
                    name={`${sensor.id}_valor`}
                    stroke={sensor.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Alertas Recientes</h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredSensors
            .filter(sensor => sensor.alerta)
            .slice(0, 5)
            .map((sensor, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-lg bg-red-50 border-red-200 hover:bg-red-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">
                        {dict(SENSOR_TYPES).get(sensor.tipo)}
                      </span>
                      <Chip color="danger" size="sm">Alerta</Chip>
                    </div>
                    
                    <div className="mt-1">
                      <span className="text-gray-600 font-medium">
                        Ubicación: {getLocationName(sensor)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-red-600">
                      {formatNumber(sensor.valor)} {sensor.unidad}
                    </span>
                    {sensor.umbral_minimo !== null && sensor.umbral_maximo !== null && (
                      <span className="text-sm text-gray-600">
                        Rango esperado: {formatNumber(sensor.umbral_minimo)}-{formatNumber(sensor.umbral_maximo)} {sensor.unidad}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Fecha:</span> {new Date(sensor.fecha).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">ID Sensor:</span> {sensor.id}
                  </div>
                </div>
              </div>
            ))}
            
          {filteredSensors.filter(sensor => sensor.alerta).length === 0 && (
            <div className="p-4 border rounded-lg bg-green-50 border-green-200 text-center">
              No hay alertas activas en los filtros seleccionados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}