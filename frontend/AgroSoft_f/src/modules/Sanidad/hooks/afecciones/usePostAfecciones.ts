import { useMutation } from "@tanstack/react-query";
import { Afecciones } from "../../types";
import { postAfecciones } from "../../api/afeccionesApi";
import { queryClient } from "@/api/queryClient";

export const usePostAfeccion = () => {
  return useMutation<Afecciones, Error, any>({
    mutationFn: postAfecciones,
    onSuccess: (data) => {
      console.log("Afección realizada con éxito", data);

      // Actualiza el caché manualmente
      if (data && data.id && data.nombre) { // Ajusta según tu tipo Afecciones
        queryClient.setQueryData(['afecciones'], (oldData: Afecciones[] | undefined) => {
          if (oldData) {
            return [...oldData, data];
          } else {
            return [data];
          }
        });
      } else {
        console.error("La respuesta del servidor no tiene el formato esperado:", data);
      }
    },
    onError: (error) => {
      console.error('ERROR al crear la afección:', error);
    },
  });
};