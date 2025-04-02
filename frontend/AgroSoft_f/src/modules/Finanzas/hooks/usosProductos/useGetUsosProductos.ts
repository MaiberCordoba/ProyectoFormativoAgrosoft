import { useQuery } from "@tanstack/react-query";
import { getUsosProductos } from "../../api/usosProductosApi";
import { UsosProductos } from "../../types";

export const useGetUsosProductos = () => {
  return useQuery<UsosProductos[], Error>({
    queryKey: ["usosProductos"], 
    queryFn: getUsosProductos, 
  });
};
