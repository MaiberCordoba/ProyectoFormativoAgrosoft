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
  opcionesEstado?: OpcionEstado[];
  filtroEstado?: Set<string>;
  onCambiarFiltroEstado?: (filtro: Set<string>) => void;
  placeholderBusqueda?: string;
  className?: string; // Añadido para permitir clases personalizadas
}

export const FiltrosTabla: React.FC<FiltrosTablaProps> = ({
  valorFiltro,
  onCambiarBusqueda,
  onLimpiarBusqueda,
  opcionesEstado,
  filtroEstado,
  onCambiarFiltroEstado,
  placeholderBusqueda = "Buscar por nombre...",
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      <Input
        isClearable
        className="w-full" // Flexible, sin max-w-xs
        placeholder={placeholderBusqueda}
        startContent={<SearchIcon className="text-default-400" />}
        value={valorFiltro}
        onClear={onLimpiarBusqueda}
        onValueChange={onCambiarBusqueda}
        size="sm"
        aria-label="Buscar"
      />
      {opcionesEstado && opcionesEstado.length > 0 && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={
                <ChevronDownIcon
                  className="text-gray-400"
                  width={16}
                  height={16}
                />
              }
              variant="flat"
              size="sm"
              className="w-auto"
            >
              Estado
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Status filter"
            closeOnSelect={false}
            selectedKeys={filtroEstado}
            selectionMode="multiple"
            onSelectionChange={(keys) => {
              const keysSet = new Set(Array.from(keys).map(String));
              onCambiarFiltroEstado!(keysSet);
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