import { useQuery } from "@tanstack/react-query";
import { Afecciones } from "../../types";
import { getTipoAfecciones } from "../../api/tipoAfecciones";

export const useGetTipoAfecciones = () => {
  return useQuery<Afecciones[]>({
    queryKey: ["TiposAfecciones"], 
    queryFn: getTipoAfecciones,
  });
};