import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchInsumos } from '../../api/insumosApi';
import { Insumos } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchInsumos = () => {
  const queryClient = useQueryClient();

  return useMutation<Insumos, Error, { id: number; data: Partial<Insumos> }>({
    mutationFn: ({ id, data }) => patchInsumos(id, data),
    onSuccess: (updatedInsumos, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Insumos[]>(['insumos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((insumo) =>
          insumo.id === variables.id ? { ...insumo, ...updatedInsumos } : insumo
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El insumo se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el insumo",
        color: "danger",
       
      });
    }
  });
};
