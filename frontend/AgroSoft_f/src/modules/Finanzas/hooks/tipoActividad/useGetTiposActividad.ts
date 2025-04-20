import { useQuery } from "@tanstack/react-query";
import { getTipoActividad } from "../../api/tipoActividadApi";
import { TipoActividad } from "../../types";

export const useGetTipoActividad = () => {
  return useQuery<TipoActividad[], Error>({
    queryKey: ["tipoActividad"], 
    queryFn: getTipoActividad, 
  });
};

