import { Card, CardHeader, CardBody, Chip, Spinner } from "@heroui/react";
import { ResumenEconomicoListado } from "../../types";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";

interface CultivoResumenCardProps {
  resumen: ResumenEconomicoListado;
  onSelect?: () => void;
}

export const CultivoResumenCard = ({ resumen, onSelect }: CultivoResumenCardProps) => {
  // Fetch all crops
  const { data: cultivos, isLoading, isError } = useGetCultivos();

  // Find the image URL for the current cultivo_id
  const imgUrl = cultivos?.find((cultivo) => cultivo.id === resumen.cultivo_id)?.img;

  // Determinar el color basado en el beneficio
  const beneficioColor = resumen.beneficio >= 0 ? "success" : "danger";
  const relacionColor = resumen.relacion_beneficio_costo >= 1 ? "success" : "warning";

  // Validar fecha de siembra
  const isValidDate = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const year = date.getFullYear();
    return !isNaN(date.getTime()) && year >= 1900 && year <= new Date().getFullYear();
  };

  // Formatear fecha o mostrar mensaje de error
  const fechaSiembraDisplay = resumen.fecha_siembra
    ? isValidDate(resumen.fecha_siembra)
      ? resumen.fecha_siembra
      : "Fecha inválida"
    : "No disponible";

  return (
    <Card
      className="w-full max-w-[400px] hover:shadow-lg transition-shadow cursor-pointer"
      isPressable
      onPress={onSelect}
    >
      <CardHeader className="flex justify-between items-start gap-2">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold truncate">
            {resumen.nombre_cultivo || "No disponible"}
          </h3>
          <p className="text-small text-default-500">
            Siembra: {fechaSiembraDisplay}
          </p>
          <p className="text-small text-default-500">
            Era: {resumen.nombre_era || "No disponible"}
          </p>
        </div>
        <Chip color={beneficioColor} variant="flat">
          {resumen.beneficio >= 0 ? "Ganancia" : "Pérdida"}
        </Chip>
      </CardHeader>

      <CardBody className="grid grid-cols-2 gap-4">
        {/* Columna izquierda - Datos financieros */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-default-500">Ingresos:</span>
            <span className="font-semibold">
              ${resumen.total_ventas.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-default-500">Egresos:</span>
            <span className="font-semibold">
              ${resumen.total_costos.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-default-500">Mano de obra semillero:</span>
            <span className="font-semibold">
              ${resumen.mano_obra_semillero.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-default-500">Depreciación:</span>
            <span className="font-semibold">
              ${resumen.total_depreciacion.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">Beneficio:</span>
            <Chip color={beneficioColor} size="sm" className="font-bold">
              ${Math.abs(resumen.beneficio).toLocaleString()}
            </Chip>
          </div>
        </div>

        {/* Columna derecha - Relación B/C e imagen */}
        <div className="flex flex-col items-end justify-between">
          <div className="text-center">
            <p className="text-xs text-default-500">Relación B/C</p>
            <Chip color={relacionColor} size="lg" className="font-bold text-lg">
              {resumen.relacion_beneficio_costo.toFixed(2)}
            </Chip>
          </div>
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Spinner size="sm" />
              </div>
            ) : isError || !imgUrl ? (
              <div className="w-full h-full bg-default-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-default-400">Sin imagen</span>
              </div>
            ) : (
              <img
                src={imgUrl}
                alt={resumen.nombre_cultivo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/80?text=Sin+Imagen";
                }}
              />
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};