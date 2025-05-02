import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postEspecies } from "../../api/especiesApi";
import { Especies } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostEspecies = () => {
  const queryClient = useQueryClient();

  return useMutation<Especies, Error, FormData>({
    mutationKey: ['crearEspecies'],
    mutationFn: postEspecies, // espera FormData
    onSuccess: (data) => {
      console.log("Especie creada con éxito:", data);

      queryClient.invalidateQueries({ queryKey: ['especies'] }); // clave en minúscula y consistente

      addToast({
        title: 'Creación exitosa',
        description: 'Nueva especie registrada con éxito',
        color: 'success',
      });
    },
    onError: (error) => {
      console.error("Error al crear la especie:", error);
      addToast({
        title: 'Error al crear especie',
        description: 'No fue posible registrar la nueva especie',
        color: 'danger', // color corregido
      });
    },
  });
};
