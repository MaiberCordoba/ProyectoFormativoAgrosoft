import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchAfecciones } from '../../api/afeccionesApi';
import { Afecciones } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchAfecciones = () => {
  const queryClient = useQueryClient();

  return useMutation<Afecciones, Error, { id: number; data: Partial<Afecciones> }>({
    mutationFn: ({ id, data }) => patchAfecciones(id, data),
    onSuccess: (updatedAfeccion, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Afecciones[]>(['afecciones'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((afeccion) =>
          afeccion.id === variables.id ? { ...afeccion, ...updatedAfeccion } : afeccion
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La afección se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la afección",
        color: "danger",
       
      });
    }
  });
};