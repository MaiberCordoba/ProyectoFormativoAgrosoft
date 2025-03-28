import apiClient from "@/api/apiClient";
import { UsosProductos } from "../types";

export const getUsosProductos = async (): Promise<UsosProductos[]> => {
  const response = await apiClient.get("usos-productos/")
  return response.data
}

export const postUsoProducto = async (UsosProductosData: Partial<UsosProductos>): Promise<UsosProductos> => {
  const response = await apiClient.post("usos-productos/", UsosProductosData);
  return response.data;
};

export const patchUsosProductos = async ( id: number, data: Partial<UsosProductos>): Promise<UsosProductos> => {

    const response = await apiClient.patch<UsosProductos>(`usos-productos/${id}/`, data);
    return response.data;
  };

  export const deleteUsosProductos = async (id: number): Promise<UsosProductos> => {
    const response = await apiClient.delete<UsosProductos>(`usos-productos/${id}/`);
    return response.data
}