import { useQuery } from "@tanstack/react-query";
import { getUnidadesTiempo } from "../../api/unidadesTiempoApi";
import { UnidadesTiempo } from "../../types";

export const useGetUnidadesTiempo = () => {
  return useQuery<UnidadesTiempo[], Error>({
    queryKey: ["unidadesTiempo"], 
    queryFn: getUnidadesTiempo, 
  });
};
