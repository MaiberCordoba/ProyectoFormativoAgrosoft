import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postVentas } from "../../api/ventasApi";
import { addToast } from "@heroui/toast";
import { Ventas } from "../../types";

interface PostVentasData {
  cosechas: { cosecha: number; cantidad: number; unidad_medida: number; descuento: number }[];
}

export const usePostVentas = () => {
  const queryClient = useQueryClient();

  return useMutation<Ventas, Error, PostVentasData>({
    mutationKey: ["crearVenta"],
    mutationFn: postVentas,
    onSuccess: (data) => {
      console.log("Venta creada con éxito:", data);
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      addToast({
        title: "Creación exitosa",
        description: "Nueva venta registrada con éxito",
        color: "success",
      });
    },
    onError: (error) => {
      console.error("Error al crear la venta:", error);
      addToast({
        title: "Error al crear la venta",
        description: `No fue posible registrar la venta: ${error.message}`,
        color: "danger",
      });
    },
  });
};