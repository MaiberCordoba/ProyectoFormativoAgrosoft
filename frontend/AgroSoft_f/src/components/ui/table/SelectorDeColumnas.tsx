import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";
import { Selection } from "@heroui/react";

interface SelectorColumnasProps {
  columnas: { uid: string; name: string }[];
  visibleColumns: Selection;
  setVisibleColumns: (columns: Selection) => void;
}

/**
 * Componente para seleccionar columnas visibles en una tabla
 * @param columnas Array con todas las columnas disponibles
 * @param visibleColumns Columnas actualmente visibles
 * @param setVisibleColumns Función para actualizar columnas visibles
 */
export const SelectorColumnas = ({
  columnas,
  visibleColumns,
  setVisibleColumns
}: SelectorColumnasProps) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          endContent={<ChevronDownIcon size={16} />} 
          variant="flat" 
          size="sm"
          className="hidden sm:flex" // Solo visible en desktop
        >
          Columnas
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Columnas de tabla"
        closeOnSelect={false}
        selectedKeys={visibleColumns}
        selectionMode="multiple"
        onSelectionChange={setVisibleColumns}
      >
        {columnas.map((columna) => (
          <DropdownItem key={columna.uid} className="capitalize">
            {columna.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};