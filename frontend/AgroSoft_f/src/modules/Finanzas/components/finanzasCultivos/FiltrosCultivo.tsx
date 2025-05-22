import { FiltroFecha } from "@/components/ui/filtroFecha";
import { Especies, TiposEspecie } from "@/modules/Trazabilidad/types";
import { Select, SelectItem, Button } from "@heroui/react";

interface FiltrosCultivosProps {
  tiposEspecie: TiposEspecie[];
  especies: Especies[];
  tipoEspecieId: number | null;
  especieId: number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  onTipoEspecieChange: (id: number | null) => void;
  onEspecieChange: (id: number | null) => void;
  onFechaChange: (filtros: { fechaInicio: string | null; fechaFin: string | null }) => void;
  onReset: () => void;
}

export const FiltrosCultivos = ({
  tiposEspecie,
  especies,
  tipoEspecieId,
  especieId,
  fechaInicio,
  fechaFin,
  onTipoEspecieChange,
  onEspecieChange,
  onFechaChange,
  onReset,
}: FiltrosCultivosProps) => {
  const especiesFiltradas = tipoEspecieId
    ? especies.filter(especie => especie.fk_tipoespecie === tipoEspecieId)
    : especies;

    return (
      <div className="mb-6">
        <div className="flex gap-4 items-end"> {/* Cambiamos a flex para alinear horizontalmente */}
          {/* Filtro por Tipo de Especie */}
          <div className="flex-1"> {/* flex-1 para que los filtros ocupen espacio igual */}
            <Select
              label="Tipo de Especie"
              placeholder="Selecciona un tipo"
              selectedKeys={tipoEspecieId ? [tipoEspecieId.toString()] : []}
              onChange={(e) =>
                onTipoEspecieChange(e.target.value ? parseInt(e.target.value) : null)
              }
              size="sm" // Añadimos size="sm" para hacerlo más pequeño
            >
              {tiposEspecie.map((tipo) => (
                <SelectItem key={tipo.id}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </Select>
          </div>
  
          {/* Filtro por Especie */}
          <div className="flex-1">
            <Select
              label="Especie"
              placeholder="Selecciona una especie"
              isDisabled={!tipoEspecieId}
              selectedKeys={especieId ? [especieId.toString()] : []}
              onChange={(e) =>
                onEspecieChange(e.target.value ? parseInt(e.target.value) : null)
              }
              size="sm"
            >
              {especiesFiltradas.map((especie) => (
                <SelectItem key={especie.id}>
                  {especie.nombre}
                </SelectItem>
              ))}
            </Select>
          </div>
  
          {/* Filtro por Fecha de Siembra */}
          <div className="flex-1">
            <FiltroFecha
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              onChange={onFechaChange}
              onLimpiar={() => onFechaChange({ fechaInicio: null, fechaFin: null })}
            />
          </div>
  
          {/* Botón para resetear filtros */}
          <div> {/* Quitamos el col-span-1 y justify-end para que se alinee con los demás */}
            <Button
              color="default"
              onPress={onReset}
              isDisabled={!tipoEspecieId && !especieId && !fechaInicio && !fechaFin}
              size="sm"
            >
              Limpiar
            </Button>
          </div>
        </div>
      </div>
    );
};