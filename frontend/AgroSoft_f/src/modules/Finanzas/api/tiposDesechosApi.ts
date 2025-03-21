import apiClient from "@/api/apiClient";
import { TiposDesechos } from "../types";

export const getTiposDesechos = async (): Promise<TiposDesechos[]> => {
  const response = await apiClient.get("tipos-desechos/")
  return response.data
}

export const postTiposDesechos = async (TiposDesechosData: Partial<TiposDesechos>): Promise<TiposDesechos> => {
  const response = await apiClient.post("tipos-desechos/", TiposDesechosData);
  return response.data;
};

export const putTiposDesechos = async (id: number, data: TiposDesechos): Promise<TiposDesechos> => {
  const response = await apiClient.put(`tipos-desechos/${id}/`, data);
  return response.data;
}

export const deleteTiposDesechos = async (id: number): Promise<void> => {
  await apiClient.delete(`tipos-desechos/${id}/`)
}