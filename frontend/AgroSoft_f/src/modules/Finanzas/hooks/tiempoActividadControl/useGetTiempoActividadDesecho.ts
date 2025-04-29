import { useQuery } from "@tanstack/react-query";
import { getTiempoActividadControl } from "../../api/tiempoActividadControlApi";
import { TiempoActividadControl } from "../../types";

export const useGetTiempoActividadControl = () => {
  return useQuery<TiempoActividadControl[], Error>({
    queryKey: ["TiempoActivividadControl"], 
    queryFn: getTiempoActividadControl, 
  });
};

