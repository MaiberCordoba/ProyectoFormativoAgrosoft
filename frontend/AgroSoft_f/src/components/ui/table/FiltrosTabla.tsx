import React from "react";
import { Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { SearchIcon, ChevronDownIcon } from "./Icons";

interface OpcionEstado {
  uid: string;
  nombre: string;
}

interface FiltrosTablaProps {
  valorFiltro: string;
  onCambiarBusqueda: (valor: string) => void;
  onLimpiarBusqueda: () => void;
  opcionesEstado?: OpcionEstado[]; // Ahora es opcional
  filtroEstado: Set<string>;
  onCambiarFiltroEstado: (filtro: Set<string>) => void;
  placeholderBusqueda?: string;
}

export const FiltrosTabla: React.FC<FiltrosTablaProps> = ({
  valorFiltro,
  onCambiarBusqueda,
  onLimpiarBusqueda,
  opcionesEstado, // Ahora es opcional
  filtroEstado,
  onCambiarFiltroEstado,
  placeholderBusqueda = "Buscar por nombre...",
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Campo de búsqueda */}
      <Input
        isClearable
        className="w-64"
        placeholder={placeholderBusqueda}
        startContent={<SearchIcon className="text-gray-400" />}
        value={valorFiltro}
        onClear={onLimpiarBusqueda}
        onValueChange={onCambiarBusqueda}
      />

      {/* Dropdown para filtrar por estado (solo si hay opciones de estado) */}
      {opcionesEstado && opcionesEstado.length > 0 && ( // Verificamos que opcionesEstado esté definido y no esté vacío
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<ChevronDownIcon className="text-gray-400" />}
              variant="flat"
              className="w-32"
            >
              Estado
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Filtro de estado"
            closeOnSelect={false}
            selectedKeys={filtroEstado}
            selectionMode="multiple"
            onSelectionChange={(keys) => {
              const keysComoStrings = new Set(Array.from(keys).map((key) => String(key)));
              onCambiarFiltroEstado(keysComoStrings);
            }}
          >
            {opcionesEstado.map((estado) => (
              <DropdownItem key={estado.uid} className="capitalize">
                {estado.nombre}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};