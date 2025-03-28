import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cultivos } from "../../types";
import { deleteCultivos } from "../../api/cultivosApi";
import { addToast } from "@heroui/react";

export const useDeleteCultivos = () => {
    const queryClient = useQueryClient();

    return useMutation<Cultivos, Error, { id: number }, { previousCultivos?: Cultivos[] }>({
        mutationFn: ({ id }) => deleteCultivos(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['Cultivos'] });
            const previousCultivos = queryClient.getQueryData<Cultivos[]>(['Cultivos']);
            queryClient.setQueryData<Cultivos[]>(['Cultivos'], (old) => 
                old?.filter(Cultivos => Cultivos.id !== variables.id) || []
            );
            return { previousCultivos };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el cultivo",
                color: "danger",
            });
            
            if (context?.previousCultivos) {
                console.error(error)
                queryClient.setQueryData(['Cultivos'], context.previousCultivos);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Cultivos'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El cultivo fue eliminado correctamente",
                color: "success",
            });
        }
    });
};