import apiClient from "@/api/apiClient"; // Asegúrate de tener `apiClient` configurado
import { Semillero } from "../types";

// Obtener lista de semilleros
export const getSemilleros = async (): Promise<Semillero[]> => {
  const response = await apiClient.get("semilleros/"); // Ajustamos la ruta a tu backend
  return response.data;
};

// Registrar un nuevo semillero
export const registerSemillero = async (semilleroData: Partial<Semillero>): Promise<Semillero> => {
  const response = await apiClient.post("semilleros/", semilleroData);
  return response.data;
};

// Actualizar un semillero existente
export const updateSemillero = async (semilleroData: Partial<Semillero> & { id: number }): Promise<Semillero> => {
  const { id, ...data } = semilleroData;
  const response = await apiClient.put(`semilleros/${id}/`, data);
  return response.data;
};