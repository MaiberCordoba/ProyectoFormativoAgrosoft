import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUmbral } from "../../api/umbral";
import { addToast } from "@heroui/toast";
import { Umbral } from "../../types/sensorTypes";

interface UsePostUmbralOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const usePostUmbral = (options?: UsePostUmbralOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Umbral, Error, Omit<Umbral, "id">>({
    mutationKey: ["crearUmbral"],
    mutationFn: postUmbral,
    onSuccess: (data) => {
      console.log("✅ Umbral creado con éxito:", data);
      queryClient.invalidateQueries({ queryKey: ["umbrales"] });

      addToast({
        title: "Umbral registrado",
        description: "El umbral ha sido creado correctamente.",
        variant: "flat",
        color: "success",
      });

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Error al crear el umbral:", error);

      addToast({
        title: "Error al registrar",
        description: "No se pudo crear el umbral. Intenta de nuevo.",
        variant: "flat",
        color: "danger",
      });

      options?.onError?.(error);
    },
  });
};
