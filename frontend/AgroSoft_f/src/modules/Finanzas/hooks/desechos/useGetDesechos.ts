import { useQuery } from "@tanstack/react-query";
import { getDesechos } from "../../api/desechosApi";
import { Desechos } from "../../types";

export const useGetDesechos = () => {
  return useQuery<Desechos[], Error>({
    queryKey: ["desechos"], 
    queryFn: getDesechos, 
  });
};

