import { useMutation } from "@tanstack/react-query";
import { registerCultivos } from "@/modules/Trazabilidad/api/cultivoApi";
import { Cultivos } from "../types";

export const useRegisterCultivo = () => {
  return useMutation<Cultivos, Error, Partial<Cultivos>>({
    mutationFn: registerCultivos,
  });
};
