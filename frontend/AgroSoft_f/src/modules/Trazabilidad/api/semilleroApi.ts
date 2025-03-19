import apiClient from "@/api/apiClient"; // Asegúrate de tener `apiClient` configurado
import { Semillero } from "../types";

export const getSemilleros = async (): Promise<Semillero[]> => {
  const response = await apiClient.get("semilleros/"); // Ajustamos la ruta a tu backend
  return response.data;
};

export const registerSemillero = async (semilleroData: Partial<Semillero>): Promise<Semillero> => {
  const response = await apiClient.post("semilleros/", semilleroData);
  return response.data;
};