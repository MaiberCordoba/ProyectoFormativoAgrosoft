import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "../../api/sensor";
import { SensorData } from "../../types/sensorTypes";
import { addToast } from "@heroui/toast";

export const usePostSensor = () => {
  const queryClient = useQueryClient();

  return useMutation<SensorData, Error, SensorData>({
    mutationKey: ["crearSensor"],
    mutationFn: post,
    onSuccess: (data) => {
      console.log("Sensor creado con éxito:", data);

      queryClient.invalidateQueries({ queryKey: ["sensor"] });

      addToast({
        title: "Creación exitosa",
        description: "Nuevo sensor registrado con éxito.",
        color: "success",
      });
    },
    onError: (error) => {
      console.error("Error al crear el sensor:", error);
      addToast({
        title: "Error al crear el sensor",
        description: "No fue posible registrar el nuevo sensor.",
        color: "danger",
      });
    },
  });
};