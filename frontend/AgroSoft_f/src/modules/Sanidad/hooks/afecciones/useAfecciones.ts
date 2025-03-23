import { useQuery } from "@tanstack/react-query";
import { getAfecciones } from "../../api/afeccionesApi";
import { Afecciones } from "../../types";

export const useAfecciones = () => {
  return useQuery<Afecciones[], Error>({
    queryKey: ["afecciones"], 
    queryFn: getAfecciones, 
  });
};

