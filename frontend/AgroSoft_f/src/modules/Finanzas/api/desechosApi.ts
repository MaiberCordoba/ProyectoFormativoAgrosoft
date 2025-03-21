import apiClient from "@/api/apiClient";
import { Desechos } from "../types";

export const getDesechos = async (): Promise<Desechos[]> => {
  const response = await apiClient.get("desechos/")
  return response.data
}

export const postDesecho = async (DesechosData: Partial<Desechos>): Promise<Desechos> => {
  const response = await apiClient.post("desechos/", DesechosData);
  return response.data;
};

export const putDesechos = async (id: number, data: Desechos): Promise<Desechos> => {
  const response = await apiClient.put(`desechos/${id}/`, data);
  return response.data;
}

export const deleteDesechos = async (id: number): Promise<void> => {
  await apiClient.delete(`desechos/${id}/`)
}