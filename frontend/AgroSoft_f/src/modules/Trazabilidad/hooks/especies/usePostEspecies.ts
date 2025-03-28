import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postEspecies } from "../../api/especiesApi";
import { Especies } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostEspecies = () => {
  const queryClient = useQueryClient();

  return useMutation<Especies, Error, Especies>({
    mutationKey: ['crearEspecies'],
    mutationFn: postEspecies,
    onSuccess: (data) => {
      console.log("Especie creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['Especies'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva Especies registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la Especie:", error);
      addToast({
        title: 'Error al crear la Especies',
        description: 'No fue posible  registrar nueva Especies',
        color: 'success'
      })
    },
  });
};