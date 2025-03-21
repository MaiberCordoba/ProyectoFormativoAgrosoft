import { useMutation } from "@tanstack/react-query";
import { updateSemillero } from "../api/semilleroApi";
import { Semillero } from "../types";

export const useUpdateSemillero = () => {
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Semillero>) => {
      return updateSemillero({ id, ...data });
    },
  });
};
