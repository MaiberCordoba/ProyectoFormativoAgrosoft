import { useQuery } from "@tanstack/react-query";
import {getTipoAfecciones} from "../../api/tipoAfecciones";
import { Afecciones } from "../../types";

export const useGetTipoAfecciones = () => {
  return useQuery<Afecciones[]>({
    queryKey: ["tiposAfecciones"], 
    queryFn: getTipoAfecciones,
  });
};