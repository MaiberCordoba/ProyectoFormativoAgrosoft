import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchProductosControl } from '../../api/productosControl';
import { ProductosControl } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchProductosControl = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductosControl, Error, { id: number; data: Partial<ProductosControl> }>({
    mutationFn: ({ id, data }) => patchProductosControl(id, data),
    onSuccess: (updatedProductosControl, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<ProductosControl[]>(['ProductosControl'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((productoControl) =>
          productoControl.id === variables.id ? { ...productoControl, ...updatedProductosControl } : productoControl
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El producto de control se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el producto de control",
        color: "danger",
      });
    }
  });
};
