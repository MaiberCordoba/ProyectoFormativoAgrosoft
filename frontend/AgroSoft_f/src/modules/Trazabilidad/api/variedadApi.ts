import apiClient from "@/api/apiClient";
import { Variedad } from "../types";

export const getVariedad = async ():Promise<Variedad[]> => {
    const response = await apiClient.get("variedad");
    return response.data
};

export const postVariedad = async (data?:any):Promise<Variedad> => {
    const response = await apiClient.post<Variedad>('variedad',data);
    return response.data
}

export const patchVariedad = async ( id: number, data: Partial<Variedad>): Promise<Variedad> => {
    const response = await apiClient.patch<Variedad>(`variedad${id}/`, data);
    return response.data;
  };


export const deleteVariedad = async (id: number): Promise<Variedad> => {
    const response = await apiClient.delete<Variedad>(`variedad${id}/`);
    return response.data
}