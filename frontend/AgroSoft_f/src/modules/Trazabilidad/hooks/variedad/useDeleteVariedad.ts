import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Variedad } from "../../types";
import { deleteVariedad } from "../../api/variedadApi";
import { addToast } from "@heroui/react";

export const useDeleteVariedad = () => {
    const queryClient = useQueryClient();

    return useMutation<Variedad, Error, { id: number }, { previousVariedad?: Variedad[] }>({
        mutationFn: ({ id }) => deleteVariedad(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['variedad'] });
            const previousVariedad = queryClient.getQueryData<Variedad[]>(['variedad']);
            queryClient.setQueryData<Variedad[]>(['variedad'], (old) => 
                old?.filter(Variedad => Variedad.id !== variables.id) || []
            );
            return { previousVariedad };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la variedad",
                color: "danger",
            });
            
            if (context?.previousVariedad) {
                console.error(error)
                queryClient.setQueryData(['variedad'], context.previousVariedad);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['variedad'] });
            
            addToast({
                title: "Operación exitosa",
                description: "la variedad fue eliminada correctamente",
                color: "success",
            });
        }
    });
};