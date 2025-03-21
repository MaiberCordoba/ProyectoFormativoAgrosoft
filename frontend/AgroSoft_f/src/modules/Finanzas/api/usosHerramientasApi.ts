import apiClient from "@/api/apiClient";
import { UsosHerramientas } from "../types";

export const getUsosHerramientas = async (): Promise<UsosHerramientas[]> => {
  const response = await apiClient.get("usosherramientas/")
  return response.data
}

export const postUsoHerramienta = async (UsosHerramientasData: Partial<UsosHerramientas>): Promise<UsosHerramientas> => {
  const response = await apiClient.post("usosherramientas/", UsosHerramientasData);
  return response.data;
};

export const putUsosHerramientas = async (id: number, data: UsosHerramientas): Promise<UsosHerramientas> => {
  const response = await apiClient.put(`usosherramientas/${id}/`, data);
  return response.data;
}

export const deleteUsosHerramientas = async (id: number): Promise<void> => {
  await apiClient.delete(`usosherramientas/${id}/`)
}