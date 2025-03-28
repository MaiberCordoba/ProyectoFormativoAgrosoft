import { useQuery } from "@tanstack/react-query";
import { UsoProductosControl } from "../../types";
import { getUsoProductosControl } from "../../api/UsoproductosControl";

export const usegetUsoProductosControl = () => {
  return useQuery<UsoProductosControl[]>({
    queryKey: ["UsoProductosControl"],
    queryFn: getUsoProductosControl,
  });
};
