import React from "react";
import { Select, SelectItem } from "@heroui/react";

interface FilasPorPaginaProps {
  filasPorPagina: number;
  onChange: (value: number) => void;
}

export const FilasPorPagina: React.FC<FilasPorPaginaProps> = ({
  filasPorPagina,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2 ml-auto"> {/* ml-auto para alinear a la derecha */}
      <span className="text-default-400 text-small">Filas por página:</span>
      <Select
        aria-label="Filas por página"
        selectedKeys={[String(filasPorPagina)]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          onChange(Number(selected));
        }}
        variant="underlined"
        className="w-24 " // Ancho fijo
        size="sm" // Tamaño pequeño
      >
        <SelectItem key="5">5</SelectItem>
        <SelectItem key="10">10</SelectItem>
        <SelectItem key="15">15</SelectItem>
      </Select>
    </div>
  );
};