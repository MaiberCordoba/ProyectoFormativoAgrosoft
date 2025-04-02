import { useQuery } from "@tanstack/react-query";
import { getCosechas } from "../../api/cosechasApi";
import { Cosechas } from "../../types";

export const useGetCosechas = () => {
  return useQuery<Cosechas[], Error>({
    queryKey: ["cosechas"], 
    queryFn: getCosechas, 
  });
};

