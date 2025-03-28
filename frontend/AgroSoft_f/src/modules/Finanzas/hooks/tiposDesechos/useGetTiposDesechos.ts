import { useQuery } from "@tanstack/react-query";
import { getTiposDesechos } from "../../api/tiposDesechosApi";
import { TiposDesechos } from "../../types";

export const useGetTiposDesechos = () => {
  return useQuery<TiposDesechos[], Error>({
    queryKey: ["tiposDesechos"], 
    queryFn: getTiposDesechos, 
  });
};

