import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPlantaciones } from "../../api/plantacionesApi";
import { Plantaciones } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostPlantaciones = () => {
  const queryClient = useQueryClient();

  return useMutation<Plantaciones, Error, Plantaciones>({
    mutationKey: ['crearPlantaciones'],
    mutationFn: postPlantaciones,
    onSuccess: (data) => {
      console.log("era creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['Plantaciones'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva Plantaciones registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la era:", error);
      addToast({
        title: 'Error al crear la Plantaciones',
        description: 'No fue posible  registrar nueva Plantaciones',
        color: 'success'
      })
    },
  });
};