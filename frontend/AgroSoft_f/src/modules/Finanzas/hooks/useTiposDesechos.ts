import { useQuery, useMutation } from "@tanstack/react-query";
import { getTiposDesechos, postTiposDesechos } from "../api/tiposDesechosApi";
import { TiposDesechos } from "../types";


export const useTiposDesechos = () => {
  return useQuery({
    queryKey: ["tiposDesechos"], 
    queryFn: getTiposDesechos,
  });
};

export const usePostTiposDesechos = () => {
  return useMutation<TiposDesechos, Error, Partial<TiposDesechos>>({
    mutationFn: postTiposDesechos,
  });
};