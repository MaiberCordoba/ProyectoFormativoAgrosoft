import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUsoProductosControl } from '../../api/UsoproductosControl';
import { UsoProductosControl } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchUsoProductosControl = () => {
  const queryClient = useQueryClient();

  return useMutation<UsoProductosControl, Error, { id: number; data: Partial<UsoProductosControl> }>({
    mutationFn: ({ id, data }) => patchUsoProductosControl(id, data),
    onSuccess: (updatedUsoProductosControl, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<UsoProductosControl[]>(['UsoProductosControl'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((usoproductoControl) =>
          usoproductoControl.id === variables.id ? { ...usoproductoControl, ...updatedUsoProductosControl } : usoproductoControl
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El uso del producto del control se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el uso producto del control",
        color: "danger",
      });
    }
  });
};
