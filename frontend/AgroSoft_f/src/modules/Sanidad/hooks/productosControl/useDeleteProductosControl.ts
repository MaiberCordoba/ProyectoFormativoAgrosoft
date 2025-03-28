import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductosControl } from "../../types";
import { deleteProductosControl } from "../../api/productosControl";
import { addToast } from "@heroui/react";

export const useDeleteProductosControl = () => {
    const queryClient = useQueryClient();

    return useMutation<ProductosControl, Error, { id: number }, { previousProductosControl?: ProductosControl[] }>({
        mutationFn: ({ id }) => deleteProductosControl(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["ProductosControl"] });
            const previousProductosControl = queryClient.getQueryData<ProductosControl[]>(["ProductosControl"]);
            queryClient.setQueryData<ProductosControl[]>(["ProductosControl"], (old) =>
                old?.filter((productoControl) => productoControl.id !== variables.id) || []
            );
            return { previousProductosControl };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el producto de control",
                color: "danger",
            });

            if (context?.previousProductosControl) {
                console.error(error);
                queryClient.setQueryData(["ProductosControl"], context.previousProductosControl);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ProductosControl"] });

            addToast({
                title: "Operación exitosa",
                description: "El producto de control fue eliminado correctamente",
                color: "success",
            });
        },
    });
};
