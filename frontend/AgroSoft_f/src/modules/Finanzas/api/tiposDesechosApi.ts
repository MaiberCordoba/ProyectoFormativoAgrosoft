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

export const patchTiposDesechos = async ( id: number, data: Partial<TiposDesechos>): Promise<TiposDesechos> => {
    const response = await apiClient.patch<TiposDesechos>(`Tipos-desechos/${id}/`, data);
    return response.data;
  };

  export const deleteTiposDesechos = async (id: number): Promise<TiposDesechos> => {
    const response = await apiClient.delete<TiposDesechos>(`Tipos-desechos/${id}/`);
    return response.data
}