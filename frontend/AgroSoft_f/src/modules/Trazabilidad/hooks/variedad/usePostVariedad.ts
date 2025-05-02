import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postVariedad } from "../../api/variedadApi";
import { Variedad } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostVariedad = () => {
  const queryClient = useQueryClient();

  return useMutation<Variedad, Error, Variedad>({
    mutationKey: ['crearVariedad'],
    mutationFn: postVariedad,
    onSuccess: (data) => {
      console.log("Cultivo creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['variedad'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva Variedad registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la variedad:", error);
      addToast({
        title: 'Error al crear la variedad',
        description: 'No fue posible  registrar nueva Variedad',
        color: 'success'
      })
    },
  });
};