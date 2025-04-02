import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../api/ventasApi";
import { Ventas } from "../../types";

export const useGetVentas = () => {
  return useQuery<Ventas[], Error>({
    queryKey: ["ventas"], 
    queryFn: getVentas, 
  });
};
