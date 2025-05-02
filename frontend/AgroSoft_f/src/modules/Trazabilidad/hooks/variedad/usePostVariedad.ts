import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postVariedad } from "../../api/variedadApi";
import { Variedad, NuevaVariedad } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostVariedad = () => {
  const queryClient = useQueryClient();

  return useMutation<Variedad, Error, NuevaVariedad>({
    mutationKey: ["crearVariedad"],
    mutationFn: postVariedad,
    onSuccess: (data) => {
      console.log("Variedad creada con éxito:", data);
      queryClient.invalidateQueries({ queryKey: ["variedad"] });

      addToast({
        title: "Creación exitosa",
        description: "Nueva Variedad registrada con éxito",
        color: "success",
      });
    },
    onError: (error) => {
      console.error("Error al crear la variedad:", error);
      addToast({
        title: "Error al crear la variedad",
        description: "No fue posible registrar la nueva variedad",
        color: "danger",
      });
    },
  });
};
