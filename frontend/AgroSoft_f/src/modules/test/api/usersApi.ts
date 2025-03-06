import apiClient from "@/api/apiClient"; // Asegúrate de tener `apiClient` configurado
import { User } from "../types";

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get("usuarios/"); // Ajustamos la ruta a tu backend
  return response.data;
};
