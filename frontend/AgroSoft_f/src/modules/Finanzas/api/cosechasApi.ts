import apiClient from "@/api/apiClient";
import { Cosechas } from "../types";

export const getCosechas = async (): Promise<Cosechas[]> => {
  const response = await apiClient.get("cosechas/")
  return response.data
}

export const postCosecha = async (CosechasData: Partial<Cosechas>): Promise<Cosechas> => {
  const response = await apiClient.post("cosechas/", CosechasData);
  return response.data;
};

export const putCosechas = async (id: number, data: Cosechas): Promise<Cosechas> => {
  const response = await apiClient.put(`cosechas/${id}/`, data);
  return response.data;
}

export const deleteCosechas = async (id: number): Promise<void> => {
  await apiClient.delete(`cosechas/${id}/`)
}