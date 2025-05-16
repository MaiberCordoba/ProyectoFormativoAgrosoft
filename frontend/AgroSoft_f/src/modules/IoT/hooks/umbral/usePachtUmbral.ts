import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putUmbral } from "../../api/umbral";
import { Umbral } from "../../types/sensorTypes";
import { addToast } from "@heroui/react";

export const usePatchUmbral = () => {
  const queryClient = useQueryClient();

  return useMutation<Umbral, Error, { id: number; data: Partial<Umbral> }>({
    mutationFn: ({ id, data }) => putUmbral(id, data),
    onSuccess: (updatedUmbral, variables) => {
      queryClient.setQueryData<Umbral[]>(["umbral"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((umbral) =>
          umbral.id === variables.id ? { ...umbral, ...updatedUmbral } : umbral
        );
      });

      addToast({
        title: "Actualización exitosa",
        description: "El umbral se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("Detalles del error:", error.response?.data);
      addToast({
        title: "Error al actualizar",
        description: error.response?.data?.detail || error.message || "No se pudo actualizar el umbral",
        color: "danger",
      });
    },
  });
};
