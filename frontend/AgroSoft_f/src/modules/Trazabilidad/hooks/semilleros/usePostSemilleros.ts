import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSemilleros } from "../../api/semillerosApi";
import { Semilleros } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostSemilleros = () => {
  const queryClient = useQueryClient();

  return useMutation<Semilleros, Error, Semilleros>({
    mutationKey: ['crearSemilleros'],
    mutationFn: postSemilleros,
    onSuccess: (data) => {
      console.log("semillero creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['Semilleros'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva Semilleros registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el semillero:", error);
      addToast({
        title: 'Error al crear la Semilleros',
        description: 'No fue posible  registrar nuevo Semilleros',
        color: 'success'
      })
    },
  });
};