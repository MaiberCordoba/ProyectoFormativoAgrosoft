import { useQuery } from "@tanstack/react-query";
import { getUsosHerramientas } from "../../api/usosHerramientasApi";
import { UsosHerramientas } from "../../types";

export const useGetUsosHerramientas = () => {
  return useQuery<UsosHerramientas[], Error>({
    queryKey: ["usosHerramientas"], 
    queryFn: getUsosHerramientas, 
  });
};

