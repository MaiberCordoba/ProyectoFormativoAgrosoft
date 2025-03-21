import { useQuery, useMutation } from "@tanstack/react-query";
import { getVentas, postVentas } from "../api/ventasApi";
import { Ventas } from "../types";


export const useVentas = () => {
  return useQuery({
    queryKey: ["Ventas"], 
    queryFn: getVentas,
  });
};

export const usePostVentas = () => {
  return useMutation<Ventas, Error, Partial<Ventas>>({
    mutationFn: postVentas,
  });
};