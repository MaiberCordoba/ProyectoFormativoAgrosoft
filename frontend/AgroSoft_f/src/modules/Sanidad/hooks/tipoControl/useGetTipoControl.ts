import { useQuery } from "@tanstack/react-query";
import { TipoControl } from "../../types";
import { getTipoControl } from "../../api/tipoControl";

export const useGetTipoControl = () => {
  return useQuery<TipoControl[]>({
    queryKey: ["TipoControl"],
    queryFn: getTipoControl,
  });
};
