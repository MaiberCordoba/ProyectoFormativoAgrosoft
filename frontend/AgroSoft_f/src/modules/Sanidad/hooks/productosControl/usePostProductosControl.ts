import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postProductosControl } from "../../api/productosControl";
import { ProductosControl } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostProductosControl = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductosControl, Error, ProductosControl>({
    mutationKey: ['ProductosControl'],
    mutationFn: postProductosControl,
    onSuccess: (data) => {
      console.log("Producto de control fue creado con éxito:", data);

      // Invalida la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['ProductosControl'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo producto de control registrado con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear el producto de control:", error);
      addToast({
        title: 'Error al crear el producto de control',
        description: 'No fue posible registrar un nuevo producto de control',
        color: 'danger'
      });
    },
  });
};
