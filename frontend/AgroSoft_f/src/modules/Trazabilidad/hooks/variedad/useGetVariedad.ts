import { useQuery } from "@tanstack/react-query";
import { getVariedad } from "../../api/variedadApi";
import { Variedad } from "../../types";

export const useGetVariedad = () => {
  return useQuery<Variedad[], Error>({
    queryKey: ["variedad"], 
    queryFn: getVariedad, 
  });
};

