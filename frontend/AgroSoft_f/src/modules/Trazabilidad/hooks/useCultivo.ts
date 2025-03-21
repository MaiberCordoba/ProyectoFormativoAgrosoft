import { useQuery } from "@tanstack/react-query";
import { getCultivos } from "../api/cultivoApi";

export const useCultivos = () => {
  return useQuery({
    queryKey: ["cultivos"], 
    queryFn: getCultivos,
  });
};
