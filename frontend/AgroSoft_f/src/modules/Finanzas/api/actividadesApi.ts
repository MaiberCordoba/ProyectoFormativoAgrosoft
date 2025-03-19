import apiClient from "@/api/apiClient";
import { Actividades } from "../types";

export const getActividades = async (): Promise<Actividades[]> => {
    const response = await apiClient.get("Actividades/")
    return response.data
}

export const registerActividad = async (actividadesData: Partial<Actividades>): Promise<Actividades> => {
  const response = await apiClient.post("Actividades/", actividadesData);
  return response.data;
};