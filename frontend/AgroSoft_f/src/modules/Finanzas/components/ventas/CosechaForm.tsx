import { Select, SelectItem, Input } from "@heroui/react";
import { Cosechas, UnidadesMedida, VentaCosecha } from "../../types";
import { Trash2, Plus } from "lucide-react";
import { Plantaciones } from "@/modules/Trazabilidad/types";
import { RoundIconButton } from "@/components/ui/buttonRound";

interface CosechaFormProps {
  index: number;
  ventaCosecha: VentaCosecha;
  cosechas: Cosechas[] | undefined;
  unidadesMedida: UnidadesMedida[] | undefined;
  plantaciones: Plantaciones[] | undefined;
  updateCosecha: (index: number, field: keyof VentaCosecha, value: number | string) => void;
  removeCosecha: (index: number) => void;
  canRemove: boolean;
  onOpenCosechaModal: () => void;
  onOpenUnidadMedidaModal: () => void;
}

export const CosechaForm = ({
  index,
  ventaCosecha,
  cosechas,
  unidadesMedida,
  plantaciones,
  updateCosecha,
  removeCosecha,
  canRemove,
  onOpenCosechaModal,
  onOpenUnidadMedidaModal,
}: CosechaFormProps) => {
  const cosechaSeleccionada = cosechas?.find((c) => c.id === ventaCosecha.cosecha);
  const unidadSeleccionada = unidadesMedida?.find((u) => u.id === ventaCosecha.unidad_medida);
  const cantidadEnBase = unidadSeleccionada ? ventaCosecha.cantidad * unidadSeleccionada.equivalenciabase : 0;
  const cantidadDisponible = cosechaSeleccionada?.cantidad_disponible ?? 0;
  const cantidadRestante = cantidadDisponible - cantidadEnBase;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2">
        <div className="flex items-center gap-2">
          <Select
            placeholder="Selecciona el producto"
            size="sm"
            selectedKeys={ventaCosecha.cosecha ? [ventaCosecha.cosecha.toString()] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              updateCosecha(index, "cosecha", selectedKey ? Number(selectedKey) : 0);
            }}
            className="flex-1"
            aria-label="Seleccionar producto" // Añadido para accesibilidad
          >
            {(cosechas || [])
              .filter((cosecha) => (cosecha.cantidad_disponible ?? 0) > 0)
              .map((cosecha) => {
                const plantacion = plantaciones?.find((p) => p.id === cosecha.fk_Plantacion);
                const producto = plantacion?.cultivo?.nombre || "Sin producto";
                const lote = plantacion?.eras.Lote?.nombre ?? "Sin lote";
                const valorGramo = typeof cosecha.valorGramo === 'string' ? parseFloat(cosecha.valorGramo) : cosecha.valorGramo;
                return (
                  <SelectItem
                    key={cosecha.id.toString()}
                    textValue={`Producto: ${producto} - Fecha: ${cosecha.fecha ?? "Sin fecha"} - Lote: ${lote}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{producto}</span>
                      <span className="text-xs">Fecha: {cosecha.fecha ?? "Sin fecha"}</span>
                      <span className="text-xs">Lote: {lote}</span>
                      <span className="text-xs">Disponible: {cosecha.cantidad_disponible ?? 0} g</span>
                      {valorGramo == null || isNaN(valorGramo) ? (
                        <span className="text-red-500 text-xs">Precio no definido</span>
                      ) : (
                        <span className="text-blue-700 text-xs">Valor por Gramo: ${valorGramo.toFixed(2)}</span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
          </Select>
          {index === 0 && (
            <RoundIconButton
               onPress={onOpenCosechaModal}
               color="success"
               icon={<Plus className="w-5 h-5" />}
            />
          )}
        </div>
      </td>
      <td className="p-2">
        <Input
          type="number"
          placeholder="Cantidad"
          size="sm"
          value={ventaCosecha.cantidad.toString()}
          onChange={(e) => updateCosecha(index, "cantidad", Number(e.target.value))}
          min="1"
          className="w-full"
          aria-label="Cantidad del producto" // Añadido para accesibilidad
        />
      </td>
      <td className="p-2 min-w-[200px]">
        <div className="flex items-center gap-2">
          <Select
            placeholder="Selecciona la unidad"
            size="sm"
            selectedKeys={ventaCosecha.unidad_medida ? [ventaCosecha.unidad_medida.toString()] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              updateCosecha(index, "unidad_medida", selectedKey ? Number(selectedKey) : 0);
            }}
            className="flex-1"
            aria-label="Seleccionar unidad de medida" // Añadido para accesibilidad
          >
            {(unidadesMedida || []).map((unidadMedida) => (
              <SelectItem key={unidadMedida.id.toString()} textValue={unidadMedida.nombre}>
                {unidadMedida.nombre}
              </SelectItem>
            ))}
          </Select>
          {index === 0 && (
            <RoundIconButton
               onPress={onOpenUnidadMedidaModal}
               color="success"
               icon={<Plus className="w-5 h-5" />}
            />
          )}
        </div>
      </td>
      <td className="p-2">
        <Input
          type="number"
          placeholder="Descuento (%)"
          size="sm"
          value={ventaCosecha.descuento.toString()}
          onChange={(e) => updateCosecha(index, "descuento", e.target.value)}
          min="0"
          max="100"
          className="w-full"
          aria-label="Porcentaje de descuento" // Añadido para accesibilidad
        />
      </td>
      <td className="p-2 text-sm">{cosechaSeleccionada ? `$${ventaCosecha.precio_unitario}` : "-"}</td>
      <td className="p-2 text-sm">{cosechaSeleccionada ? `$${ventaCosecha.valor_total}` : "-"}</td>
      <td className="p-2 text-sm">
        {cosechaSeleccionada && unidadSeleccionada && (
          <div>
            <p className={cantidadRestante < 0 ? "text-red-500" : "text-green-600"}>
              Restante: {cantidadRestante > 0 ? cantidadRestante.toFixed(2) : 0} g
            </p>
          </div>
        )}
      </td>
      <td className="p-2">
        {canRemove && (
          <RoundIconButton 
            onPress={() => removeCosecha(index)}
            color="danger"
            icon={<Trash2 className="w-5 h-5" />}>
          </RoundIconButton>
        )}
      </td>
    </tr>
  );
};