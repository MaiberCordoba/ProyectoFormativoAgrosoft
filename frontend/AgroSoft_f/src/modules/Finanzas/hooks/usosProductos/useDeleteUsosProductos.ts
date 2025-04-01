import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsosProductos } from "../../types";
import { deleteUsosProductos } from "../../api/usosProductosApi";
import { addToast } from "@heroui/react";

export const useDeleteUsoProducto = () => {
    const queryClient = useQueryClient();

    return useMutation<UsosProductos, Error, { id: number }, { previousUsoProductos?: UsosProductos[] }>({
        mutationFn: ({ id }) => deleteUsosProductos(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['usosProductos'] });
            const previousUsoProductos = queryClient.getQueryData<UsosProductos[]>(['usosProductos']);
            queryClient.setQueryData<UsosProductos[]>(['usosProductos'], (old) => 
                old?.filter(usoProducto => usoProducto.id !== variables.id) || []
            );
            return { previousUsoProductos };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el uso de producto",
                color: "danger",
            });
            
            if (context?.previousUsoProductos) {
                console.error(error)
                queryClient.setQueryData(['usosProductos'], context.previousUsoProductos);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usosProductos'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El uso de producto fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
