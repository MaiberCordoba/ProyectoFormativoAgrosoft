import apiClient from "@/api/apiClient";
import { UsosProductos } from "../types";

export const getUsosProductos = async (): Promise<UsosProductos[]> => {
  const response = await apiClient.get("usoproductosControl/")
  return response.data
}

export const postUsoProducto = async (UsosProductosData: Partial<UsosProductos>): Promise<UsosProductos> => {
  const response = await apiClient.post("usoproductosControl/", UsosProductosData);
  return response.data;
};

export const putUsosProductos = async (id: number, data: UsosProductos): Promise<UsosProductos> => {
  const response = await apiClient.put(`usoproductosControl/${id}/`, data);
  return response.data;
}

export const deleteUsosProductos = async (id: number): Promise<void> => {
  await apiClient.delete(`usoproductosControl/${id}/`)
}