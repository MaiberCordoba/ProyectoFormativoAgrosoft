import { useMutation } from "@tanstack/react-query";
import { registerSemillero } from "@/modules/Trazabilidad/api/semilleroApi";
import { Semillero } from "../types";

export const useRegisterSemillero = () => {
  return useMutation<Semillero, Error, Partial<Semillero>>({
    mutationFn: registerSemillero,
  });
};