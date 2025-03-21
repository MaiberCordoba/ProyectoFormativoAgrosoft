import apiClient from "@/api/apiClient"; // Asegúrate de tener `apiClient` configurado
import { Cultivos } from "../types";

// Obtener lista de Cultivos
export const getCultivos = async (): Promise<Cultivos[]> => {
  const response = await apiClient.get("cultivos/"); // Ajustamos la ruta a tu backend
  return response.data;
};

// Registrar un nuevo cultivo
export const registerCultivos = async (cultivoData: Partial<Cultivos>): Promise<Cultivos> => {
  const response = await apiClient.post("cultivos/", cultivoData);
  return response.data;
};

// Actualizar un cultivo existente
export const updateCultivos = async (cultivoData: Partial<Cultivos> & { id: number }): Promise<Cultivos> => {
  const { id, ...data } = cultivoData;
  const response = await apiClient.put(`cultivos/${id}/`, data);
  return response.data;
};