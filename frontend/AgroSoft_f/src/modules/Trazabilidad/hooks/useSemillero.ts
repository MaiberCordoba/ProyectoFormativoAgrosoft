import { useQuery } from "@tanstack/react-query";
import { getSemilleros } from "../api/semilleroApi";

export const useSemilleros = () => {
  return useQuery({
    queryKey: ["semilleros"], 
    queryFn: getSemilleros,
  });
};
