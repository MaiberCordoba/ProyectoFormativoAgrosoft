import apiClient from "@/api/apiClient";
import { ProductosControl } from "../types";

export const getProductosControl = async (): Promise<ProductosControl[]> => {
    const response = await apiClient.get("productosControl/");
    return response.data;
};

export const postProductosControl = async (data?: any): Promise<ProductosControl> => {
    const response = await apiClient.post<ProductosControl>('productosControl/', data);
    return response.data;
};

export const patchProductosControl = async (id: number, data: Partial<ProductosControl>): Promise<ProductosControl> => {
    const response = await apiClient.patch<ProductosControl>(`productosControl/${id}/`, data);
    return response.data;
};

export const deleteProductosControl = async (id: number): Promise<ProductosControl> => {
    const response = await apiClient.delete<ProductosControl>(`productosControl/${id}/`);
    return response.data;
};
