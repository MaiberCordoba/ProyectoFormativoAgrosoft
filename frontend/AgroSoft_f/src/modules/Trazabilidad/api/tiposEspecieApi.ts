import apiClient from "@/api/apiClient";
import { TiposEspecie } from "../types";

export const getTiposEspecie = async (): Promise<TiposEspecie[]> => {
  const response = await apiClient.get("tiposespecie/");
  return response.data;
};


export const postTiposEspecie = async (data: FormData): Promise<TiposEspecie> => {
  const response = await apiClient.post<TiposEspecie>('tiposespecie/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const patchTiposEspecie = async (id: number, data: FormData): Promise<TiposEspecie> => {
  const response = await apiClient.patch<TiposEspecie>(`tiposespecie/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const deleteTiposEspecie = async (id: number): Promise<TiposEspecie> => {
  const response = await apiClient.delete<TiposEspecie>(`tiposespecie/${id}/`);
  return response.data;
};
