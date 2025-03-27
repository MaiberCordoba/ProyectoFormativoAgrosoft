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

export const patchUsosProductos = async ( id: number, data: Partial<UsosProductos>): Promise<UsosProductos> => {
    const response = await apiClient.patch<UsosProductos>(`usoproductosControl/${id}/`, data);
    return response.data;
  };

  export const deleteUsosProductos = async (id: number): Promise<UsosProductos> => {
    const response = await apiClient.delete<UsosProductos>(`usoproductosControl/${id}/`);
    return response.data
}