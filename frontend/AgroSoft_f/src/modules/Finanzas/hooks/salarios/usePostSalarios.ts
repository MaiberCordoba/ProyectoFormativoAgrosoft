import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSalario } from "../../api/salariosApi";
import { Salarios } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostSalario = () => {
  const queryClient = useQueryClient();

  return useMutation<Salarios, Error,Salarios>({
    mutationKey: ['crearSalario'],
    mutationFn: postSalario,
    onSuccess: (data) => {
      console.log("Salario creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['salarios'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo salario registrado con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el salario:", error);
      addToast({
        title: 'Error al crear el salario',
        description: 'No fue posible registrar un nuevo salario',
        color: 'success'
      })
    },
  });
};
