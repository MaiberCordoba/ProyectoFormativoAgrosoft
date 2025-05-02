import apiClient from "@/api/apiClient";
import { Variedad, NuevaVariedad } from "../types";

// Obtener lista de variedades
export const getVariedad = async (): Promise<Variedad[]> => {
  const response = await apiClient.get("variedad/");
  return response.data;
};

// Crear una nueva variedad
export const postVariedad = async (data: NuevaVariedad): Promise<Variedad> => {
  const response = await apiClient.post<Variedad>("variedad/", data);
  return response.data;
};

// Actualizar una variedad existente
export const patchVariedad = async (id: number, data: Partial<Variedad>): Promise<Variedad> => {
  const response = await apiClient.patch<Variedad>(`variedad/${id}/`, data);
  return response.data;
};

// Eliminar una variedad
export const deleteVariedad = async (id: number): Promise<void> => {
  await apiClient.delete(`variedad/${id}/`);
};
