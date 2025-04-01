import { useQuery } from "@tanstack/react-query";
import { TiposAfecciones } from "../../types";
import { getTipoAfecciones } from "../../api/tipoAfecciones";

export const useGetTipoAfecciones = () => {
  return useQuery<TiposAfecciones[]>({
    queryKey: ["TiposAfecciones"], 
    queryFn: getTipoAfecciones,
  });
};