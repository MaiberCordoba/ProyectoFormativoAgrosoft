import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchEspecies } from '../../api/especiesApi';
import { Especies } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchEspecies = () => {
  const queryClient = useQueryClient();

  return useMutation<Especies, Error, { id: number; data: Partial<Especies> }>({
    mutationFn: ({ id, data }) => patchEspecies(id, data),
    onSuccess: (updatedEspecies, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Especies[]>(['Especies'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((Especies) =>
            Especies.id === variables.id ? { ...Especies, ...updatedEspecies } : Especies
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "la especie se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la especie",
        color: "danger",
       
      });
    }
  });
};