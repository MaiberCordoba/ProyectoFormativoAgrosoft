import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUsoProducto } from "../../api/usosProductosApi";
import { UsosProductos } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostUsoProducto = () => {
  const queryClient = useQueryClient();

  return useMutation<UsosProductos, Error, UsosProductos>({
    mutationKey: ['crearUsoProducto'],
    mutationFn: postUsoProducto,
    onSuccess: (data) => {
      console.log("Uso de producto creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['usosProductos'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo uso de producto registrado con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el uso de producto:", error);
      addToast({
        title: 'Error al crear el uso de producto',
        description: 'No fue posible registrar nuevo uso de producto',
        color: 'danger'
      })
    },
  });
};
