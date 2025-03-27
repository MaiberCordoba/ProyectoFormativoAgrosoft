import { useQuery } from "@tanstack/react-query";
import { getActividades } from "../../api/actividadesApi";
import { Actividades } from "../../types";

export const useGetActividades = () => {
  return useQuery<Actividades[], Error>({
    queryKey: ["actividades"], 
    queryFn: getActividades, 
  });
};

