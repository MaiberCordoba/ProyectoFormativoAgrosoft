import { useQuery } from "@tanstack/react-query";
import { getSalarios } from "../../api/salariosApi";
import { Salarios } from "../../types";

export const useGetSalarios = () => {
  return useQuery<Salarios[], Error>({
    queryKey: ["salarios"], 
    queryFn: getSalarios, 
  });
};

