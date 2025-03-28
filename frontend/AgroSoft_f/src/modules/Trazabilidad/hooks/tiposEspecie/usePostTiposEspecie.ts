import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTiposEspecie } from "../../api/tiposEspecieApi";
import { TiposEspecie } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostTiposEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposEspecie, Error, TiposEspecie>({
    mutationKey: ['crearTiposEspecie'],
    mutationFn: postTiposEspecie,
    onSuccess: (data) => {
      console.log("Afección creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['TiposEspecie'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva TiposEspecie registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la afección:", error);
      addToast({
        title: 'Error al crear la TiposEspecie',
        description: 'No fue posible  registrar nueva TiposEspecie',
        color: 'success'
      })
    },
  });
};