// src/components/FiltroFecha.tsx (Actualizado para corregir el día de visualización/envío)
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Calendar } from "lucide-react";

interface FiltroFechaProps {
  fechaInicio: string | null;
  fechaFin: string | null;
  onChange: (filtros: {
    fechaInicio: string | null;
    fechaFin: string | null;
  }) => void;
  onLimpiar: () => void;
}

export const FiltroFecha: React.FC<FiltroFechaProps> = ({
  fechaInicio,
  fechaFin,
  onChange,
  onLimpiar,
}) => {
  const [mostrarPopover, setMostrarPopover] = useState(false);

  // Usamos estados locales para los inputs del popover
  const [localFechaInicio, setLocalFechaInicio] = useState<string | null>(
    fechaInicio
  );
  const [localFechaFin, setLocalFechaFin] = useState<string | null>(fechaFin);

  // Sincronizar estados locales con props cuando el popover se abre o las props cambian
  useEffect(() => {
    setLocalFechaInicio(fechaInicio);
    setLocalFechaFin(fechaFin);
  }, [fechaInicio, fechaFin]);

  const handleApply = () => {
    // Aquí es donde ajustamos para que la fecha enviada sea exactamente la del input
    // No convertimos a Date y luego a string, enviamos la cadena directa del input
    onChange({ fechaInicio: localFechaInicio, fechaFin: localFechaFin });
    setMostrarPopover(false);
  };

  const handleClear = () => {
    onLimpiar();
    setLocalFechaInicio(null);
    setLocalFechaFin(null);
    setMostrarPopover(false);
  };

  // Función para formatear la fecha para la visualización,
  // asegurando que siempre sea la fecha UTC para evitar deslices de un día.
  const formatDisplayDate = (dateString: string | null): string => {
    if (!dateString) return "";
    // Parsear la fecha como UTC para evitar problemas de zona horaria al mostrar
    const date = new Date(dateString + "T00:00:00Z"); // Añadir 'T00:00:00Z' la fuerza a ser UTC medianoche
    return date.toLocaleDateString("es-CO", { timeZone: "UTC" }); // Especificar timeZone 'UTC'
  };

  return (
    <div className="flex items-center gap-2">
      <Popover isOpen={mostrarPopover} onOpenChange={setMostrarPopover}>
        <PopoverTrigger>
          <Button
            size="sm"
            variant="flat"
            endContent={
              <Calendar className="text-gray-400" width={16} height={16} />
            }
          >
            Filtrar por fecha
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-[300px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Desde:</label>
              <Input
                type="date"
                value={localFechaInicio || ""}
                onChange={(e) => setLocalFechaInicio(e.target.value || null)}
                size="sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Hasta:</label>
              <Input
                type="date"
                value={localFechaFin || ""}
                onChange={(e) => setLocalFechaFin(e.target.value || null)}
                size="sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="light" onPress={handleClear}>
                Limpiar
              </Button>
              <Button size="sm" color="primary" onPress={handleApply}>
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {fechaInicio || fechaFin ? (
        <span className="text-xs text-default-500">
          {fechaInicio && `Desde: ${formatDisplayDate(fechaInicio)}`}
          {fechaFin && ` Hasta: ${formatDisplayDate(fechaFin)}`}
        </span>
      ) : null}
    </div>
  );
};
