import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUsoProductosControl } from "../../api/UsoproductosControl";
import { UsoProductosControl } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostProductosControl = () => {
  const queryClient = useQueryClient();

  return useMutation<UsoProductosControl, Error, UsoProductosControl>({
    mutationKey: ['UsoProductosControl'],
    mutationFn: postUsoProductosControl,
    onSuccess: (data) => {
      console.log("uso del Producto del control fue creado con éxito:", data);

      // Invalida la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['UsoProductosControl'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo uso del  producto de control registrado con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear el uso del producto de control:", error);
      addToast({
        title: 'Error al crear el producto de control',
        description: 'No fue posible registrar un nuevo uso de producto de control',
        color: 'danger'
      });
    },
  });
};
