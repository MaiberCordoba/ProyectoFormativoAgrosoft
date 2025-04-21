import { Especies, TiposEspecie } from "@/modules/Trazabilidad/types";
import {  Select, SelectItem, Button } from "@heroui/react";

interface FiltrosCultivosProps {
  tiposEspecie: TiposEspecie[];
  especies: Especies[];
  tipoEspecieId: number | null;
  especieId: number | null;
  onTipoEspecieChange: (id: number | null) => void;
  onEspecieChange: (id: number | null) => void;
  onReset: () => void;
}

export const FiltrosCultivos = ({
  tiposEspecie,
  especies,
  tipoEspecieId,
  especieId,
  onTipoEspecieChange,
  onEspecieChange,
  onReset,
}: FiltrosCultivosProps) => {
  // Filtrar especies basadas en el tipo seleccionado
  const especiesFiltradas = tipoEspecieId
    ? especies.filter(especie => especie.fk_tipoespecie === tipoEspecieId)
    : especies;

  return (
    <div className="mb-6">
      <div className="flex gap-4 items-end">
        {/* Filtro por Tipo de Especie */}
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Tipo de Especie"
            placeholder="Selecciona un tipo"
            selectedKeys={tipoEspecieId ? [tipoEspecieId.toString()] : []}
            onChange={(e) =>
              onTipoEspecieChange(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            {tiposEspecie.map((tipo) => (
              <SelectItem key={tipo.id}>
                {tipo.nombre}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Filtro por Especie */}
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Especie"
            placeholder="Selecciona una especie"
            isDisabled={!tipoEspecieId}
            selectedKeys={especieId ? [especieId.toString()] : []}
            onChange={(e) =>
              onEspecieChange(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            {especiesFiltradas.map((especie) => (
              <SelectItem key={especie.id} >
                {especie.nombre}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Botón para resetear filtros */}
        <Button
          variant="flat"
          color="default"
          onPress={onReset}
          isDisabled={!tipoEspecieId && !especieId}
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
};