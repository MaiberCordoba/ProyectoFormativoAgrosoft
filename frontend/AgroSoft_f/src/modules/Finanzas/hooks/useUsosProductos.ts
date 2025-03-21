import { useQuery, useMutation } from "@tanstack/react-query";
import { getUsosProductos, postUsoProducto } from "../api/usosProductosApi";
import { UsosProductos } from "../types";


export const useUsosProductos = () => {
  return useQuery({
    queryKey: ["usosProductos"], 
    queryFn: getUsosProductos,
  });
};

export const usePostUsosProductos = () => {
  return useMutation<UsosProductos, Error, Partial<UsosProductos>>({
    mutationFn: postUsoProducto,
  });
};