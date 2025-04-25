import { useQuery } from "@tanstack/react-query";
import { getUmbrales } from "../../api/umbral";
import { Umbral } from "../../types/sensorTypes";

export const useGetUmbral = () => {
  return useQuery<Umbral[], Error>({
    queryKey: ["umbrales"],
    queryFn: getUmbrales,
  });
};