import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchAfecciones } from '../../api/afeccionesApi';
import { Afecciones } from '../../types';

export const useActualizarAfeccion = () => {
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
    },
  });
};