import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUmbral } from "../../api/umbral";
import { Umbral } from "../../types/sensorTypes";
import { addToast } from "@heroui/react";

export const useDeleteUmbral = () => {
  const queryClient = useQueryClient();

  return useMutation<Umbral, Error, { id: number }, { previousUmbrales?: Umbral[] }>({
    mutationFn: ({ id }) => deleteUmbral(id),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["umbrales"] });

      const previousUmbrales = queryClient.getQueryData<Umbral[]>(["umbrales"]);

      queryClient.setQueryData<Umbral[]>(["umbrales"], (old) =>
        old?.filter((umbral) => umbral.id !== variables.id) || []
      );

      return { previousUmbrales };
    },

    onError: (error, _variables, context) => {
      addToast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el umbral.",
        variant: "flat",
        color: "danger",
      });

      if (context?.previousUmbrales) {
        console.error(error);
        queryClient.setQueryData(["umbrales"], context.previousUmbrales);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["umbrales"] });

      addToast({
        title: "Operación exitosa",
        description: "El umbral fue eliminado correctamente.",
        variant: "flat",
        color: "success",
      });
    },
  });
};
