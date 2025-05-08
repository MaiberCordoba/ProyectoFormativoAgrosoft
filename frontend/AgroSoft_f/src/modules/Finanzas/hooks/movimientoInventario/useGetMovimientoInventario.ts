import { useQuery } from "@tanstack/react-query";
import { getMovimientoInventario } from "../../api/movimientoInventarioApi";
import { MovimientoInventario } from "../../types";

export const useGetMovimientoInventario = () => {
  return useQuery<MovimientoInventario[], Error>({
    queryKey: ["movimientosInventario"], 
    queryFn: getMovimientoInventario, 
  });
};

