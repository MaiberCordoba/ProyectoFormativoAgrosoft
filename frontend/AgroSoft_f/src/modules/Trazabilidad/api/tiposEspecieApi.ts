import apiClient from "@/api/apiClient";
import { TiposEspecie } from "../types";

export const getTiposEspecie = async ():Promise<TiposEspecie[]> => {
    const response = await apiClient.get("tiposespecie/");
    return response.data
};

export const postTiposEspecie = async (data?:any):Promise<TiposEspecie> => {
    const response = await apiClient.post<TiposEspecie>('tiposespecie/',data);
    return response.data
}

export const patchTiposEspecie = async ( id: number, data: Partial<TiposEspecie>): Promise<TiposEspecie> => {
    const response = await apiClient.patch<TiposEspecie>(`tiposespecie/${id}/`, data);
    return response.data;
  };


export const deleteTiposEspecie = async (id: number): Promise<TiposEspecie> => {
    const response = await apiClient.delete<TiposEspecie>(`tiposespecie/${id}/`);
    return response.data
}