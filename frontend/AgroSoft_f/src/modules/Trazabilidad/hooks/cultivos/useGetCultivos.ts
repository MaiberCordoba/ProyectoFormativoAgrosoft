import { useQuery } from "@tanstack/react-query";
import { getCultivos } from "../../api/cultivosApi";
import { Cultivos } from "../../types";

export const useGetCultivos = () => {
  return useQuery<Cultivos[], Error>({
    queryKey: ["Cultivos"], 
    queryFn: getCultivos, 
  });
};

