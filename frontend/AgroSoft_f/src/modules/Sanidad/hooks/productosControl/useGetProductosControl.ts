import { useQuery } from "@tanstack/react-query";
import { ProductosControl } from "../../types";
import { getProductosControl } from "../../api/productosControl";

export const useGetProductosControl = () => {
  return useQuery<ProductosControl[]>({
    queryKey: ["ProductosControl"],
    queryFn: getProductosControl,
  });
};
