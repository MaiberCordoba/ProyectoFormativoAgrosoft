import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchVariedad } from '../../api/variedadApi';
import { Variedad } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchVariedad = () => {
  const queryClient = useQueryClient();

  return useMutation<Variedad, Error, { id: number; data: Partial<Variedad> }>({
    mutationFn: ({ id, data }) => patchVariedad(id, data),
    onSuccess: (updatedVariedad, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Variedad[]>(['variedad'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((Variedad) =>
            Variedad.id === variables.id ? { ...Variedad, ...updatedVariedad } : Variedad
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La variedad se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la variedad",
        color: "danger",
       
      });
    }
  });
};