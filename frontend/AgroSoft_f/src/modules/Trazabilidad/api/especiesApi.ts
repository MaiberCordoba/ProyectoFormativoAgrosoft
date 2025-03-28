import apiClient from "@/api/apiClient";
import { Especies } from "../types";

export const getEspecies = async ():Promise<Especies[]> => {
    const response = await apiClient.get("especies/");
    return response.data
};

export const postEspecies = async (data?:any):Promise<Especies> => {
    const response = await apiClient.post<Especies>('especies/',data);
    return response.data
}

export const patchEspecies = async ( id: number, data: Partial<Especies>): Promise<Especies> => {
    const response = await apiClient.patch<Especies>(`especies/${id}/`, data);
    return response.data;
  };


export const deleteEspecies = async (id: number): Promise<Especies> => {
    const response = await apiClient.delete<Especies>(`especies/${id}/`);
    return response.data
}