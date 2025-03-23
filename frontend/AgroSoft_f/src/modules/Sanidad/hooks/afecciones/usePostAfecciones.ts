import { useMutation } from "@tanstack/react-query"
import { Afecciones } from "../../types"
import { postAfecciones } from "../../api/afeccionesApi"
import { queryClient } from "@/api/queryClient"


export const usePostAfeccion = () => {
    return useMutation<Afecciones,Error,any>({
        mutationFn: postAfecciones,
        onSuccess: (data) => {
            console.log("afeccion realizada con exito", data);

            queryClient.setQueryData(
                ['afecciones'],
                (oldData: Afecciones[]) => [...oldData, data]);

            queryClient.invalidateQueries({queryKey:['afecciones']});
        },
        onError:( error) => {
            console.error('ERROR al crear la afeccion:', error);
        },
    })
}