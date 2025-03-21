import { useQuery, useMutation } from "@tanstack/react-query";
import { getActividades, postActividad } from "../api/actividadesApi";
import { Actividades } from "../types";


export const useActividades = () => {
  return useQuery({
    queryKey: ["actividades"], 
    queryFn: getActividades,
  });
};

export const usePostActividades = () => {
  return useMutation<Actividades, Error, Partial<Actividades>>({
    mutationFn: postActividad,
  });
};