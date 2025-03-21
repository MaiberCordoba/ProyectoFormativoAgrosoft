import { useQuery, useMutation } from "@tanstack/react-query";
import { getUsosHerramientas, postUsoHerramienta } from "../api/usosHerramientasApi";
import { UsosHerramientas } from "../types";


export const useUsosHerramientas = () => {
  return useQuery({
    queryKey: ["usosHerramientas"], 
    queryFn: getUsosHerramientas,
  });
};

export const usePostUsosHerramientas = () => {
  return useMutation<UsosHerramientas, Error, Partial<UsosHerramientas>>({
    mutationFn: postUsoHerramienta,
  });
};