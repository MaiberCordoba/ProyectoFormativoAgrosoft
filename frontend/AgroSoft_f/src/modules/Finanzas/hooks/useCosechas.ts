import { useQuery, useMutation } from "@tanstack/react-query";
import { getCosechas, postCosecha} from "../api/cosechasApi";
import { Cosechas } from "../types";


export const useCosechas = () => {
  return useQuery({
    queryKey: ["cosechas"], 
    queryFn: getCosechas,
  });
};

export const usePostCosechas = () => {
  return useMutation<Cosechas, Error, Partial<Cosechas>>({
    mutationFn: postCosecha,
  });
};