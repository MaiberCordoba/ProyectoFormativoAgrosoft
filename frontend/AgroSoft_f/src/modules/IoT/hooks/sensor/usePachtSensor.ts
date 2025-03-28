import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patch } from "../../api/sensor";
import { SensorData } from "../../types/sensorTypes";
import { addToast } from "@heroui/react";

export const usePatchSensor = () => {
  const queryClient = useQueryClient();

  return useMutation<SensorData, Error, { id: number; data: Partial<SensorData> }>({
    mutationFn: ({ id, data }) => patch(id, data),
    onSuccess: (updatedSensor, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<SensorData[]>(['sensor'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((sensor) =>
          sensor.id === variables.id ? { ...sensor, ...updatedSensor } : sensor
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El sensor se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el sensor",
        color: "danger",
       
      });
    }
  });
};