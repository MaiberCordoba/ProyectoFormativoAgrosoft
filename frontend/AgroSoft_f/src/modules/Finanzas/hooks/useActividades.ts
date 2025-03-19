import { useQuery } from "@tanstack/react-query";
import { getActividades } from "../api/actividadesApi";

export const useActividades = () => {
  return useQuery({
    queryKey: ["actividades"], 
    queryFn: getActividades,
  });
};