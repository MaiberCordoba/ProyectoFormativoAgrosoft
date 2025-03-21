import apiClient from "@/api/apiClient";
import { Actividades } from "../types";

export const getActividades = async (): Promise<Actividades[]> => {
  const response = await apiClient.get("Actividades/")
  return response.data
}

export const postActividad = async (actividadesData: Partial<Actividades>): Promise<Actividades> => {
  const response = await apiClient.post("Actividades/", actividadesData);
  return response.data;
};

export const putActividades = async (id: number, data: Actividades): Promise<Actividades> => {
  const response = await apiClient.put(`Actividades/${id}/`, data);
  return response.data;
}

export const deleteActividades = async (id: number): Promise<void> => {
  await apiClient.delete(`Actividades/${id}/`)
}