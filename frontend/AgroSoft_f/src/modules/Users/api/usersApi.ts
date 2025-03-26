import apiClient from "@/api/apiClient";
import { User } from "../types";

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get("usuarios/");
  return response.data;
};

export const registerUser = async (userData: Partial<User>): Promise<User> => {
  const response = await apiClient.post("usuarios/", userData);
  return response.data;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  console.log("Enviando datos al backend para actualizar usuario:", id, userData); // 🔍 Verifica datos antes de enviar
  const response = await apiClient.patch(`usuarios/${id}/`, userData);
  console.log("Respuesta del backend:", response.data); // 🔍 Verifica la respuesta del servidor
  return response.data;
};


export const deleteUser = async (id: number): Promise<User> => {
  const response = await apiClient.delete<User>(`usuarios/${id}/`);
  return response.data
}