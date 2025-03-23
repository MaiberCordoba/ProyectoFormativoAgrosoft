import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { VerticalDotsIcon } from "./Icons";

interface AccionesTablaProps {
  onEditar: () => void;
  onEliminar: () => void;
}

export const AccionesTabla: React.FC<AccionesTablaProps> = ({ onEditar, onEliminar }) => {
  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light" className="text-gray-500 hover:text-gray-700">
            <VerticalDotsIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Acciones">
          <DropdownItem key="editar" onPress={onEditar}>
            Editar
          </DropdownItem>
          <DropdownItem key="eliminar" onPress={onEliminar}>
            Eliminar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};  