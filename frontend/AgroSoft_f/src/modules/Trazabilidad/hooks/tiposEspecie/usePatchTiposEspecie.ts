import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTiposEspecie } from '../../api/tiposEspecieApi';
import { TiposEspecie } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchTiposEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposEspecie, Error, { id: number; data: Partial<TiposEspecie> }>({
    mutationFn: ({ id, data }) => patchTiposEspecie(id, data),
    onSuccess: (updatedTiposEspecie, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<TiposEspecie[]>(['TiposEspecie'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((tiposEspecie) =>
            tiposEspecie.id === variables.id ? { ...tiposEspecie, ...updatedTiposEspecie } : tiposEspecie
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El tipo de especie se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el tipos de especie",
        color: "danger",
       
      });
    }
  });
};