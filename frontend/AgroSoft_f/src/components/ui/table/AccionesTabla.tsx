import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { VerticalDotsIcon } from "./Icons";

interface AccionesTablaProps {
  onEditar: () => void;
  onEliminar?: () => void;
  permitirEditar?: boolean;
  permitirEliminar?: boolean;
  onVerDetalles?: () => void;
  onDescargar?: () => void;
  renderDescargar?: () => JSX.Element;
}

export const AccionesTabla: React.FC<AccionesTablaProps> = ({
  onEditar,
  onEliminar,
  permitirEditar = true,
  permitirEliminar = true,
  onVerDetalles,
  onDescargar,
  renderDescargar,
}) => {
  const menuItems = React.useMemo(() => {
    const items = [];

    if (onVerDetalles) {
      items.push(
        <DropdownItem key="ver" onPress={onVerDetalles}>
          Ver detalles
        </DropdownItem>
      );
    }

    if (permitirEditar) {
      items.push(
        <DropdownItem key="editar" onPress={onEditar}>
          Editar
        </DropdownItem>
      );
    }

    if (onEliminar && permitirEliminar) {
      items.push(
        <DropdownItem key="eliminar" onPress={onEliminar}>
          Eliminar
        </DropdownItem>
      );
    }

    if (onDescargar) {
      items.push(
        <DropdownItem key="descargar" onPress={onDescargar}>
          Descargar Factura
        </DropdownItem>
      );
    }

    return items;
  }, [onVerDetalles, permitirEditar, permitirEliminar, onEditar, onEliminar, onDescargar]);

  return (
    <div className="relative flex justify-end items-center gap-2">
      {renderDescargar && renderDescargar()}
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" className="bg-success p-2 rounded">
            <VerticalDotsIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Acciones">{menuItems}</DropdownMenu>
      </Dropdown>
    </div>
  );
};