import apiClient from "@/api/apiClient";
import { Semilleros } from "../types";

export const getSemilleros = async ():Promise<Semilleros[]> => {
    const response = await apiClient.get("semilleros/");
    return response.data
};

export const postSemilleros = async (data?:any):Promise<Semilleros> => {
    const response = await apiClient.post<Semilleros>('semilleros/',data);
    return response.data
}

export const patchSemilleros = async ( id: number, data: Partial<Semilleros>): Promise<Semilleros> => {
    const response = await apiClient.patch<Semilleros>(`semilleros/${id}/`, data);
    return response.data;
  };


export const deleteSemilleros = async (id: number): Promise<Semilleros> => {
    const response = await apiClient.delete<Semilleros>(`semilleros/${id}/`);
    return response.data
}