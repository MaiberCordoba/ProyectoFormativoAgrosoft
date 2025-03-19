import { useQuery } from "@tanstack/react-query";
import { getCosechas } from "../api/cosechasApi";

export const useCosechas = () => {
  return useQuery({
    queryKey: ["cosechas"], 
    queryFn: getCosechas,
  });
};