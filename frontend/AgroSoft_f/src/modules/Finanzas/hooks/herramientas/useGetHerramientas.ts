import { useQuery } from "@tanstack/react-query";
import { getHerramientas } from "../../api/herramientasApi";
import { Herramientas } from "../../types";

export const useGetHerramientas = () => {
  return useQuery<Herramientas[], Error>({
    queryKey: ["herramientas"], 
    queryFn: getHerramientas, 
  });
};

