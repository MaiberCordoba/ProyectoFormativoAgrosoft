import apiClient from "@/api/apiClient";
import { Cultivos } from "../types";

export const getCultivos = async ():Promise<Cultivos[]> => {
    const response = await apiClient.get("cultivos/");
    return response.data
};

export const postCultivos = async (data?:any):Promise<Cultivos> => {
    const response = await apiClient.post<Cultivos>('cultivos/',data);
    return response.data
}

export const patchCultivos = async ( id: number, data: Partial<Cultivos>): Promise<Cultivos> => {
    const response = await apiClient.patch<Cultivos>(`cultivos/${id}/`, data);
    return response.data;
  };


export const deleteCultivos = async (id: number): Promise<Cultivos> => {
    const response = await apiClient.delete<Cultivos>(`cultivos/${id}/`);
    return response.data
}