import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUsosProductos } from '../../api/usosProductosApi';
import { UsosProductos } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchUsosProductos = () => {
  const queryClient = useQueryClient();

  return useMutation<UsosProductos, Error, { id: number; data: Partial<UsosProductos> }>({
    mutationFn: ({ id, data }) => patchUsosProductos(id, data),
    onSuccess: (updatedUsoProducto, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<UsosProductos[]>(['usosProductos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((usoProducto) =>
          usoProducto.id === variables.id ? { ...usoProducto, ...updatedUsoProducto } : usoProducto
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El uso de producto se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el uso de producto",
        color: "danger",
       
      });
    }
  });
};
