import { useQuery } from "@tanstack/react-query";
import { getTiempoActividadControl } from "../../api/tiempoActividadControlApi";
import { TiempoActividadControl } from "../../types";

export const useGetTiempoActividadControl = () => {
    const query = useQuery<TiempoActividadControl[], Error>({
    queryKey: ["TiempoActivividadControl"], 
    queryFn: getTiempoActividadControl, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};

