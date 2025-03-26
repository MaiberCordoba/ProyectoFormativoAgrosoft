import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCultivos } from "../../api/cultivosApi";
import { Cultivos } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostCultivos = () => {
  const queryClient = useQueryClient();

  return useMutation<Cultivos, Error, Cultivos>({
    mutationKey: ['crearCultivos'],
    mutationFn: postCultivos,
    onSuccess: (data) => {
      console.log("Cultivo creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['Cultivos'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva Cultivos registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la Cultivo:", error);
      addToast({
        title: 'Error al crear la Cultivos',
        description: 'No fue posible  registrar nueva Cultivos',
        color: 'success'
      })
    },
  });
};