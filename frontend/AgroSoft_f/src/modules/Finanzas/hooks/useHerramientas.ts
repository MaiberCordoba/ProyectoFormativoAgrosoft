import { useQuery, useMutation } from "@tanstack/react-query";
import { getHerramientas, postHerramienta } from "../api/herramientasApi";
import { Herramientas } from "../types";


export const useHerramientas = () => {
  return useQuery({
    queryKey: ["herramientas"], 
    queryFn: getHerramientas,
  });
};

export const usePostHerramientas = () => {
  return useMutation<Herramientas, Error, Partial<Herramientas>>({
    mutationFn: postHerramienta,
  });
};