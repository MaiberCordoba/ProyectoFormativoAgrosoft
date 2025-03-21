import { useQuery, useMutation } from "@tanstack/react-query";
import { getDesechos, postDesecho } from "../api/desechosApi";
import { Desechos } from "../types";


export const useDesechos = () => {
  return useQuery({
    queryKey: ["desechos"], 
    queryFn: getDesechos,
  });
};

export const usePostDesechos = () => {
  return useMutation<Desechos, Error, Partial<Desechos>>({
    mutationFn: postDesecho,
  });
};