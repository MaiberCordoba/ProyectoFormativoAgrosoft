import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAfecciones } from "../../api/afeccionesApi";
import { Afecciones } from "../../types";

export const usePostAfeccion = () => {
  const queryClient = useQueryClient();

  return useMutation<Afecciones, Error, Afecciones>({
    mutationKey: ['crearAfeccion'],
    mutationFn: postAfecciones,
    onSuccess: (data) => {
      console.log("Afección creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['afecciones'] });
    },
    onError: (error) => {
      console.error("Error al crear la afección:", error);
    },
  });
};