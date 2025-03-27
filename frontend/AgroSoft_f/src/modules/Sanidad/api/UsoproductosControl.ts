import apiClient from "@/api/apiClient";
import { UsoProductosControl } from "../types";

export const getUsoProductosControl = async (): Promise<UsoProductosControl[]> => {
    const response = await apiClient.get("usoproductosControl/");
    return response.data;
};

export const postUsoProductosControl = async (data?: any): Promise<UsoProductosControl> => {
    const response = await apiClient.post<UsoProductosControl>("usoproductosControl/", data);
    return response.data;
};

export const patchUsoProductosControl = async (id: number, data: Partial<UsoProductosControl>): Promise<UsoProductosControl> => {
    const response = await apiClient.patch<UsoProductosControl>(`usoproductosControl/${id}/`, data);
    return response.data;
};

export const deleteUsoProductosControl = async (id: number): Promise<UsoProductosControl> => {
    const response = await apiClient.delete<UsoProductosControl>(`usoproductosControl/${id}/`);
    return response.data;
};
