import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchVentas } from "../../api/ventasApi";
import { Ventas } from "../../types";
import { addToast } from "@heroui/toast";

interface PatchVentasData {
  id: number;
  data: { cosechas: { cosecha: number; cantidad: number; unidad_medida: number; descuento: number }[] };
}

export const usePatchVentas = () => {
  const queryClient = useQueryClient();

  return useMutation<Ventas, Error, PatchVentasData>({
    mutationFn: ({ id, data }) => patchVentas(id, data),
    onSuccess: (updatedVenta, variables) => {
      queryClient.setQueryData<Ventas[]>(["ventas"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((venta) =>
          venta.id === variables.id ? { ...venta, ...updatedVenta } : venta
        );
      });
      addToast({
        title: "Actualización exitosa",
        description: "La venta se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error("Error al actualizar la venta:", error);
      addToast({
        title: "Error al actualizar",
        description: `No se pudo actualizar la venta: ${error.message}`,
        color: "danger",
      });
    },
  });
};