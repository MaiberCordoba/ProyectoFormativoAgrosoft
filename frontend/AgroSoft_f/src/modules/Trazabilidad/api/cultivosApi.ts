import apiClient from "@/api/apiClient";
import { Cultivo } from "../types";

export const getCultivos = async ():Promise<Cultivo[]> => {
    const response = await apiClient.get("cultivos/");
    return response.data
};

export const postCultivos = async (data: FormData): Promise<Cultivo> => {
  const response = await apiClient.post<Cultivo>('cultivos/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Actualizar un tipo de especie (también con FormData)
export const patchCultivos = async (id: number, data: FormData): Promise<Cultivo> => {
  const response = await apiClient.patch<Cultivo>(`cultivos/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const deleteCultivos = async (id: number): Promise<Cultivo> => {
    const response = await apiClient.delete<Cultivo>(`cultivos/${id}/`);
    return response.data
}