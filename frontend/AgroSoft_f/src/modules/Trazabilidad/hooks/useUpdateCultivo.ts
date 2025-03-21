import { useMutation } from "@tanstack/react-query";
import { updateCultivos } from "../api/cultivoApi";
import { Cultivos } from "../types";

export const useUpdateCultivo = () => {
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Cultivos>) => {
      return updateCultivos({ id, ...data });
    },
  });
};
