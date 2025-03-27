import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsoProductosControl  } from "../../types";
import { deleteUsoProductosControl } from "../../api/UsoproductosControl";
import { addToast } from "@heroui/react";

export const useDeleteUseProductosControl = () => {
    const queryClient = useQueryClient();

    return useMutation<UsoProductosControl , Error, { id: number }, { previousUsoProductosControl ?: UsoProductosControl [] }>({
        mutationFn: ({ id }) => deleteUsoProductosControl(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["UsoProductosControl"] });
            const previousUsoProductosControl = queryClient.getQueryData<UsoProductosControl[]>(["UsoProductosControl"]);
            queryClient.setQueryData<UsoProductosControl []>(["UsoProductosControl"], (old) =>
                old?.filter((usoproductoControl) => usoproductoControl.id !== variables.id) || []
            );
            return { previousUsoProductosControl };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el uso producto del control",
                color: "danger",
            });

            if (context?.previousUsoProductosControl) {
                console.error(error);
                queryClient.setQueryData(["UsoProductosControl"], context.previousUsoProductosControl);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["UsoProductosControl"] });

            addToast({
                title: "Operación exitosa",
                description: "El uso del  producto del control fue eliminado correctamente",
                color: "success",
            });
        },
    });
};
