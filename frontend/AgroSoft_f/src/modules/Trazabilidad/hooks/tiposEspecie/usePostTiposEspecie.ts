import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTiposEspecie } from "../../api/tiposEspecieApi";
import { TiposEspecie } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostTiposEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposEspecie, Error, FormData>({
    mutationKey: ['crearTiposEspecie'],
    mutationFn: postTiposEspecie,
    onSuccess: (data) => {
      console.log("Tipo de especie creada con éxito:", data);

      queryClient.invalidateQueries({ queryKey: ['tiposEspecie'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo tipo de especie registrado con éxito',
        color: 'success',
      });
    },
    onError: (error) => {
      console.error("Error al crear el tipo de especie:", error);
      addToast({
        title: 'Error al crear tipo de especie',
        description: 'No fue posible registrar el tipo de especie',
        color: 'danger',
      });
    },
  });
};
